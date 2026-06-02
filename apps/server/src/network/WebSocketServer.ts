import { WebSocketServer as WSServer, WebSocket } from "ws"
import { MatchManager } from "../core/MatchManager"
import { CommandProcessor } from "../core/CommandProcessor"
import { BoosterSetManager } from "../core/boosters/BoosterSetManager"
import { MatchPhase } from "../core/matchPhase"

export class GameWebSocketServer {
  private wss: WSServer
  private clients = new Set<WebSocket>()
  private boosterSetManager = new BoosterSetManager()

  constructor(
    port: number,
    private readonly matchManager: MatchManager,
    private readonly commandProcessor: CommandProcessor
  ) {
    this.wss = new WSServer({ port })
    this.initialize()
  }

  private initialize() {
    this.wss.on("connection", (socket: WebSocket) => {
      console.log("websocket client connected")
      this.clients.add(socket)

      socket.on("close", () => {
        this.clients.delete(socket)

        const matchId = (socket as any).matchId
        const playerId = (socket as any).playerId

        if (matchId && playerId) {
          this.matchManager.disconnectPlayer(matchId, playerId)
          this.broadcastMatchState(matchId)
        }

        console.log("websocket client disconnected")
      })

      socket.on("message", (raw) => {
        try {
          const message = JSON.parse(raw.toString())
          this.handleMessage(socket, message)
        } catch (error) {
          console.error("[WebSocket] invalid message", error)
        }
      })
    })
  }

  private handleMessage(socket: WebSocket, message: any) {
    switch (message.type) {
      case "CREATE_MATCH":
        this.handleCreateMatch(socket, message)
        break
      case "JOIN_MATCH":
        this.handleJoinMatch(socket, message)
        break
      case "SELECT_BOOSTER":
        this.handleSelectBooster(socket, message)
        break
    }
  }

  private handleCreateMatch(socket: WebSocket, message: any) {
    const payload = message.payload ?? {}
    const match = this.matchManager.createMatch(payload)

    match.state.turnTimeSeconds = payload.turnTimerSeconds ?? 15
    match.state.targetPoints = payload.targetPoints ?? 10
    match.state.boosterSetSize = payload.boosterSetSize ?? 3
    match.state.exhaustiblePool = payload.exhaustiblePool ?? true

    // Сохраняем ID матча для сокета
    ;(socket as any).matchId = match.id

    // 🔥 Добавляем тестовых игроков автоматически
    const testPlayerNames = [
      "catViewer",
      "secondCat",
      "thirdCat",
      "fourthCat",
      "fifthCat",
      "sosixCat",
      "sseventhCat",
      "eighthCat",
      "ninthCat",
      "tenthCat",
    ]
    for (let i = 0; i < testPlayerNames.length; i++) {
      const playerId = `player_${i + 1}`
      this.matchManager.addPlayerToMatch(match.id, playerId, testPlayerNames[i])
    }

    // Инициализация бустеров и старт матча
    this.boosterSetManager.initialize(match)
    match.start()

    // Отправляем клиенту подтверждение создания матча
    socket.send(
      JSON.stringify({
        type: "MATCH_CREATED",
        data: { matchId: match.id },
      })
    )

    // Отправляем всем клиентам текущее состояние матча
    this.broadcastMatchState(match.id)
  }

  private handleJoinMatch(socket: WebSocket, message: any) {
    const { matchId, playerId, username } = message.data

    const { match } = this.matchManager.addPlayerToMatch(
      matchId,
      playerId,
      username
    )

    ;(socket as any).matchId = match.id
    ;(socket as any).playerId = playerId

    socket.send(
      JSON.stringify({
        type: "JOINED_MATCH",
        data: { matchId: match.id, playerId },
      })
    )

    this.broadcastMatchState(match.id)
  }

  private handleSelectBooster(socket: WebSocket, message: any) {
    const matchId = (socket as any).matchId
    const playerId = (socket as any).playerId
    if (!matchId || !playerId) return

    this.commandProcessor.enqueue({
      type: "SELECT_BOOSTER",
      matchId,
      playerId,
      payload: message.data,
      createdAt: Date.now(),
    })

    this.broadcastMatchState(matchId)
  }

  broadcastMatchState(matchId: string) {
    const match = this.matchManager.getMatch(matchId)
    if (!match) return

    const payload = {
      type: "match_state",
      payload: { match },
    }

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload))
      }
    }
  }

  broadcast(data: any) {
    const serialized = JSON.stringify(data)

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(serialized)
      }
    }
  }
}