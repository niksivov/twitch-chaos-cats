import { WebSocketServer as WSServer, WebSocket } from "ws"
import { MatchManager } from "../core/MatchManager"
import { CommandProcessor } from "../core/CommandProcessor"
import { RegistrationLobby } from "../core/RegistrationLobby"

// ✅ Импортируем функцию из index.ts для создания матча с игроками из Lobby
import { startTwitchBot, stopTwitchBot, createMatchFromLobby } from "../index"

export class WebSocketServer {
  private wss: WSServer
  private clients = new Set<WebSocket>()

  constructor(
    server: any,
    private readonly matchManager: MatchManager,
    private readonly commandProcessor: CommandProcessor,
    private readonly registrationLobby: RegistrationLobby
  ) {
    this.wss = new WSServer({ server })
    this.initialize()
  }

  private initialize() {
    this.wss.on("connection", (socket: WebSocket) => {
      console.log("websocket client connected")

      this.clients.add(socket)
      this.sendLobbyState(socket)

      socket.on("close", () => {
        this.clients.delete(socket)
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

      case "SELECT_BOOSTER":
        this.handleSelectBooster(socket, message)
        break

      case "GET_LOBBY":
        this.sendLobbyState(socket)
        break

      case "START_TWITCH_BOT":
        this.handleStartTwitchBot(message)
        break

      case "RESET_MATCH":
        this.handleResetMatch(socket)
        break
    }
  }

  private handleCreateMatch(socket: WebSocket, message: any) {
    const payload = message.payload ?? {}

    const match = createMatchFromLobby(payload)

    ;(socket as any).matchId = match.id

    socket.send(
      JSON.stringify({
        type: "MATCH_CREATED",
        data: { matchId: match.id },
      })
    )
  }

  private handleSelectBooster(socket: WebSocket, message: any) {
    const matchId = (socket as any).matchId
    if (!matchId) return

    const playerId = message.data?.playerId
    if (!playerId) return

    this.commandProcessor.enqueue({
      type: "SELECT_BOOSTER",
      matchId,
      playerId,
      payload: message.data,
      createdAt: Date.now(),
    })
  }

  private handleStartTwitchBot(message: any) {
    const channel = message.payload?.channel
    if (!channel) return

    console.log(`[WebSocket] START_TWITCH_BOT for channel: ${channel}`)

    startTwitchBot(channel)
    this.broadcastLobbyState()
  }

  private handleResetMatch(socket: WebSocket) {
    const matchId = (socket as any).matchId

    if (matchId) {
      this.matchManager.removeMatch(matchId)
    }

    stopTwitchBot()
    this.broadcastLobbyState()
  }

public sendLobbyState(socket?: WebSocket) {
  console.log("[WS] sendLobbyState called")
  console.log("[WS] clients count:", this.clients.size)

  const payload = {
    type: "lobby_state",
    payload: { players: [...this.registrationLobby.getPlayers()] },
  }

  const serialized = JSON.stringify(payload)

  console.log("[WS] serialized lobby_state:", serialized)

  if (socket) {
    console.log("[WS] sending to SINGLE socket")

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(serialized)
    } else {
      console.log("[WS] socket not OPEN:", socket.readyState)
    }
  } else {
    console.log("[WS] broadcasting to ALL clients")

    for (const client of this.clients) {
      console.log("[WS] client state:", client.readyState)

      if (client.readyState === WebSocket.OPEN) {
        client.send(serialized)
      }
    }
  }
}

  public broadcastLobbyState() {
    this.sendLobbyState()
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