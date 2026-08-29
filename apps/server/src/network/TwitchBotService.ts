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
    this.currentMatchId = matchId
  }

  async start(channel: string) {
    this.client = new tmi.Client({ channels: [channel] })

    this.client.on("message", (channel, tags, message, self) => {
      if (self) return

      const twitchUserId = tags["user-id"] ?? tags.username
      const username = tags.username ?? tags["display-name"] ?? "unknown"

      if (!twitchUserId) {
        return
      }

      this.handleMessage(twitchUserId, username, message)
    })

    await this.client.connect()
  }

  public createMatch(config: MatchCreateInput) {
    const twitchChannel = this.client.getChannels()[0]

    if (!twitchChannel) {
      throw new Error("Twitch channel is not connected yet")
    }

    const match = this.matchManager.createMatch({
      twitchChannel,
      maxPlayers: config.maxPlayers,
      turnTimeSeconds: config.turnTimeSeconds,
      targetPoints: config.targetPoints,
      boosterSetSize: config.boosterSetSize,
    })

    this.currentMatchId = match.id

    for (const p of this.registrationLobby.getPlayers()) {
      match.addTwitchPlayer(p.twitchUserId, p.username, p.avatarId)
    }

    this.registrationLobby.clear()

    return match
  }

  stop() {
    if (this.client) {
      this.client.disconnect()
      this.client = undefined as any
    }
    this.currentMatchId = null
  }

  private handleMessage(twitchUserId: string, username: string, message: string) {
    const msg = message.trim().toLowerCase()

    if (msg === "!join") {
      if (this.registrationLobby.hasPlayer(twitchUserId)) {
        return
      }

      const usedAvatars = this.registrationLobby.getPlayers().map(p => p.avatarId)
      const remainingAvatars = this.availableAvatars.filter(a => !usedAvatars.includes(a))

      if (remainingAvatars.length === 0) {
        return
      }

      const avatarId =
        remainingAvatars[Math.floor(Math.random() * remainingAvatars.length)]

      this.registrationLobby.addPlayer({
        twitchUserId,
        username,
        avatarId,
      })

      setImmediate(() => {
        this.websocketServer.broadcastLobbyState()
      })

      return
    }

    if (/^!\d+$/.test(msg)) {
      if (!this.currentMatchId) {
        return
      }

      const match = this.matchManager.getMatch(this.currentMatchId)

      if (!match) {
        return
      }

      const slot = parseInt(msg.slice(1), 10)

      // 🔹 Убираем проверку currentPlayerId полностью
      const internalPlayerId = match.getPlayerIdByTwitchId(twitchUserId) ?? twitchUserId

      // 🔹 Просто ставим команду в очередь
      this.commandProcessor.enqueue({
        type: "SELECT_BOOSTER",
        matchId: match.id,
        playerId: internalPlayerId,
        payload: { slot },
        createdAt: Date.now(),
      })
    }
  }
}