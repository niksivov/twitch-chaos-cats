import tmi from "tmi.js"
import { MatchManager } from "../core/MatchManager"
import { GameLoop } from "../core/GameLoop"
import { CommandProcessor } from "../core/CommandProcessor"
import { RegistrationLobby, RegisteredPlayer } from "../core/RegistrationLobby"
import { WebSocketServer } from "./WebSocketServer"

type MatchCreateInput = {
  maxPlayers: number
  turnTimeSeconds: number
  targetPoints: number
  boosterSetSize: number
}

export class TwitchBotService {
  private client!: tmi.Client
  private matchManager: MatchManager
  private gameLoop: GameLoop
  private commandProcessor: CommandProcessor
  private currentMatchId: string | null = null
  private availableAvatars: string[]
  private registrationLobby: RegistrationLobby
  private websocketServer: WebSocketServer

  constructor(
    registrationLobby: RegistrationLobby,
    matchManager: MatchManager,
    gameLoop: GameLoop,
    commandProcessor: CommandProcessor,
    availableAvatars: string[],
    websocketServer: WebSocketServer
  ) {
    this.registrationLobby = registrationLobby
    this.matchManager = matchManager
    this.gameLoop = gameLoop
    this.commandProcessor = commandProcessor
    this.availableAvatars = [...availableAvatars]
    this.websocketServer = websocketServer
  }

  // 🔹 Новая функция для уведомления бота о текущем матче
  public setCurrentMatch(matchId: string) {
    console.log("[TWITCH] setCurrentMatch called with matchId:", matchId)
    this.currentMatchId = matchId
  }

  async start(channel: string) {
    this.client = new tmi.Client({ channels: [channel] })

    this.client.on("message", (channel, tags, message, self) => {
      if (self) return

      const twitchUserId = tags["user-id"] ?? tags.username
      const username = tags.username ?? tags["display-name"] ?? "unknown"

      console.log("[TWITCH] Raw message received:", message)
      console.log("[TWITCH] Parsed user:", username, "id:", twitchUserId)

      if (!twitchUserId) {
        console.log("[TWITCH] Missing twitchUserId, ignoring message")
        return
      }

      this.handleMessage(twitchUserId, username, message)
    })

    await this.client.connect()
    console.log(`[TWITCH] Connected to channel: ${channel}`)
  }

  public createMatch(config: MatchCreateInput) {
    const twitchChannel = this.client.getChannels()[0]

    console.log("[MATCH] createMatch called with config:", config)
    console.log("[MATCH] twitchChannel:", twitchChannel)

    if (!twitchChannel) {
      console.log("[MATCH] ERROR: Twitch channel not connected")
      throw new Error("Twitch channel is not connected yet")
    }

    const match = this.matchManager.createMatch({
      twitchChannel,
      maxPlayers: config.maxPlayers,
      turnTimeSeconds: config.turnTimeSeconds,
      targetPoints: config.targetPoints,
      boosterSetSize: config.boosterSetSize,
    })

    console.log("[MATCH] Match created:", match.id)

    this.currentMatchId = match.id

    for (const p of this.registrationLobby.getPlayers()) {
      console.log("[MATCH] Adding lobby player:", p.username)
      match.addTwitchPlayer(p.twitchUserId, p.username, p.avatarId)
    }

    this.registrationLobby.clear()
    console.log("[MATCH] Lobby cleared after match start")

    return match
  }

  private handleMessage(twitchUserId: string, username: string, message: string) {
    const msg = message.trim().toLowerCase()

    console.log("[TWITCH] handleMessage:", { twitchUserId, username, msg })

    if (msg === "!join") {
      console.log("[LOBBY] Join request from:", username)

      if (this.registrationLobby.hasPlayer(twitchUserId)) {
        console.log("[LOBBY] Player already in lobby:", username)
        return
      }

      const usedAvatars = this.registrationLobby.getPlayers().map(p => p.avatarId)
      const remainingAvatars = this.availableAvatars.filter(a => !usedAvatars.includes(a))

      console.log("[LOBBY] Remaining avatars:", remainingAvatars.length)

      if (remainingAvatars.length === 0) {
        console.log("[LOBBY] No avatars available")
        return
      }

      const avatarId =
        remainingAvatars[Math.floor(Math.random() * remainingAvatars.length)]

      this.registrationLobby.addPlayer({
        twitchUserId,
        username,
        avatarId,
      })

      console.log(`[LOBBY] Player joined: ${username} (${avatarId})`)
      setImmediate(() => {
  this.websocketServer.broadcastLobbyState()
})
      return
    }

    if (/^!\d+$/.test(msg)) {
      console.log("[GAME] Booster command detected:", msg)

      if (!this.currentMatchId) {
        console.log("[GAME] No active match")
        return
      }

      const match = this.matchManager.getMatch(this.currentMatchId)

      if (!match) {
        console.log("[GAME] Match not found:", this.currentMatchId)
        return
      }

      const slot = parseInt(msg.slice(1), 10)

      console.log("[GAME] Parsed slot:", slot)

      // 🔹 Убираем проверку currentPlayerId полностью
      const internalPlayerId = match.getPlayerIdByTwitchId(twitchUserId) ?? twitchUserId

      console.log("[GAME] Internal player id:", internalPlayerId)

      // 🔹 Просто ставим команду в очередь
      console.log("[GAME] Enqueuing BOOST command:", {
        matchId: match.id,
        playerId: internalPlayerId,
        slot
      })

      this.commandProcessor.enqueue({
        type: "SELECT_BOOSTER",
        matchId: match.id,
        playerId: internalPlayerId,
        payload: { slot },
        createdAt: Date.now(),
      })

      console.log(`[GAME] Player ${username} activated slot ${slot}`)
    }
  }
}