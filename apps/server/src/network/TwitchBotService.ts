import tmi from "tmi.js"
import { MatchManager } from "../core/MatchManager"
import { GameLoop } from "../core/GameLoop"
import { CommandProcessor } from "../core/CommandProcessor"
import { Room } from "../core/Room"
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
  private availableAvatars: string[]
  private room: Room
  private websocketServer: WebSocketServer
  private channel: string
  private onStopped: () => void

  constructor(
    room: Room,
    matchManager: MatchManager,
    gameLoop: GameLoop,
    commandProcessor: CommandProcessor,
    availableAvatars: string[],
    websocketServer: WebSocketServer,
    channel: string,
    onStopped: () => void
  ) {
    this.room = room
    this.matchManager = matchManager
    this.gameLoop = gameLoop
    this.commandProcessor = commandProcessor
    this.availableAvatars = [...availableAvatars]
    this.websocketServer = websocketServer
    this.channel = channel
    this.onStopped = onStopped
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

      this.handleMessage(twitchUserId, username, message, tags)
    })

    this.client.on("disconnected", () => {
      this.onStopped()
    })

    await this.client.connect()
  }

  public createMatch(config: MatchCreateInput) {
    const match = this.matchManager.createMatch({
      twitchChannel: this.channel,
      maxPlayers: config.maxPlayers,
      turnTimeSeconds: config.turnTimeSeconds,
      targetPoints: config.targetPoints,
      boosterSetSize: config.boosterSetSize,
    })

    this.room.matchId = match.id

    for (const p of this.room.lobby.getPlayers()) {
      match.addTwitchPlayer(p.twitchUserId, p.username, p.avatarId)
    }

    this.room.lobby.clear()

    return match
  }

  stop() {
    if (this.client) {
      this.client.disconnect()
      this.client = undefined as any
    }
    this.room.matchId = null
  }

  private handleMessage(
    twitchUserId: string,
    username: string,
    message: string,
    tags: tmi.ChatUserstate
  ) {
    const msg = message.trim().toLowerCase()

    // !reset — только от стримера
    if (msg === "!reset") {
      const isBroadcaster = (tags as any)?.badges?.broadcaster === "1"
      if (!isBroadcaster) return

      if (this.room.matchId) {
        this.matchManager.removeMatch(this.room.matchId)
        this.room.matchId = null
      }

      this.room.lobby.clear()

      this.websocketServer.broadcastRoomJoined(this.channel)
      return
    }

    // !join — добавление в лобби комнаты
    if (msg === "!join") {
      if (this.room.matchId) {
        return
      }

      if (this.room.lobby.hasPlayer(twitchUserId)) {
        return
      }

      const usedAvatars = this.room.lobby.getPlayers().map(p => p.avatarId)
      const remainingAvatars = this.availableAvatars.filter(a => !usedAvatars.includes(a))

      if (remainingAvatars.length === 0) {
        return
      }

      const avatarId =
        remainingAvatars[Math.floor(Math.random() * remainingAvatars.length)]

      this.room.lobby.addPlayer({
        twitchUserId,
        username,
        avatarId,
      })

      setImmediate(() => {
        this.websocketServer.broadcastLobbyState(this.channel)
      })

      return
    }

    // !N — активация бустера
    if (/^!\d+$/.test(msg)) {
      if (!this.room.matchId) {
        return
      }

      const match = this.matchManager.getMatch(this.room.matchId)

      if (!match) {
        return
      }

      const slot = parseInt(msg.slice(1), 10)

      const internalPlayerId = match.getPlayerIdByTwitchId(twitchUserId) ?? twitchUserId

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
