import { WebSocketServer as WSServer, WebSocket } from "ws"
import { MatchManager } from "../core/MatchManager"
import { CommandProcessor } from "../core/CommandProcessor"
import { Room } from "../core/Room"
import { ALL_BOOSTERS } from "../core/boosters/definitions"

import { startTwitchBot, createMatchFromLobby, rooms, getOrCreateRoom } from "../index"

export class WebSocketServer {
  private wss: WSServer
  private clients = new Map<WebSocket, string | null>()
  private matchManager: MatchManager
  private commandProcessor: CommandProcessor

  constructor(
    server: any,
    matchManager: MatchManager,
    commandProcessor: CommandProcessor,
    _rooms: Map<string, Room>,
    _getOrCreateRoom: (channel: string) => Room
  ) {
    this.wss = new WSServer({ server })
    this.matchManager = matchManager
    this.commandProcessor = commandProcessor
    this.initialize()
  }

  private initialize() {
    this.wss.on("connection", (socket: WebSocket) => {
      this.clients.set(socket, null)

      socket.on("close", () => {
        this.clients.delete(socket)
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
      case "JOIN_ROOM":
        this.handleJoinRoom(socket, message)
        break

      case "CREATE_MATCH":
        this.handleCreateMatch(socket, message)
        break

      case "SELECT_BOOSTER":
        this.handleSelectBooster(socket, message)
        break

      case "GET_LOBBY":
        this.handleGetLobby(socket)
        break

      case "START_TWITCH_BOT":
        this.handleStartTwitchBot(message)
        break

      case "GET_BOOSTER_LIST":
        this.sendBoosterList(socket)
        break
    }
  }

  private handleJoinRoom(socket: WebSocket, message: any) {
    const channel = message.payload?.channel
    if (!channel) return

    this.clients.set(socket, channel)

    if (!rooms.has(channel)) {
      startTwitchBot(channel)
    }

    this.sendLobbyState(socket, channel)
  }

  private handleCreateMatch(socket: WebSocket, message: any) {
    const roomId = this.clients.get(socket)
    if (!roomId) return

    const payload = message.payload ?? {}

    const match = createMatchFromLobby(roomId, payload)

    socket.send(
      JSON.stringify({
        type: "MATCH_CREATED",
        data: { matchId: match.id },
      })
    )
  }

  private handleSelectBooster(socket: WebSocket, message: any) {
    const roomId = this.clients.get(socket)
    if (!roomId) return

    const room = rooms.get(roomId)
    if (!room?.matchId) return

    const playerId = message.data?.playerId
    if (!playerId) return

    this.commandProcessor.enqueue({
      type: "SELECT_BOOSTER",
      matchId: room.matchId,
      playerId,
      payload: message.data,
      createdAt: Date.now(),
    })
  }

  private handleStartTwitchBot(message: any) {
    const channel = message.payload?.channel
    if (!channel) return

    startTwitchBot(channel)
  }

  private handleGetLobby(socket: WebSocket) {
    const roomId = this.clients.get(socket)
    if (!roomId) return

    this.sendLobbyState(socket, roomId)
  }

  public sendLobbyState(socket: WebSocket, channel: string) {
    const room = rooms.get(channel)
    const players = room ? room.lobby.getPlayers() : []

    const payload = {
      type: "lobby_state",
      payload: { players },
    }

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload))
    }
  }

  public broadcastLobbyState(channel: string) {
    const room = rooms.get(channel)
    const players = room ? room.lobby.getPlayers() : []

    const payload = {
      type: "lobby_state",
      payload: { players },
    }

    const serialized = JSON.stringify(payload)

    for (const [client, clientRoom] of this.clients) {
      if (clientRoom === channel && client.readyState === WebSocket.OPEN) {
        client.send(serialized)
      }
    }
  }

  private sendBoosterList(socket: WebSocket) {
    const payload = {
      type: "booster_list",
      payload: ALL_BOOSTERS.map((b) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        poolCount: b.poolCount,
      })),
    }

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload))
    }
  }

  broadcast(data: any) {
    const roomId = (data as any)?.roomId
    const serialized = JSON.stringify(data)

    if (roomId) {
      for (const [client, clientRoom] of this.clients) {
        if (clientRoom === roomId && client.readyState === WebSocket.OPEN) {
          client.send(serialized)
        }
      }
    } else {
      for (const client of this.clients.keys()) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(serialized)
        }
      }
    }
  }

  public sendToRoom(channel: string, data: any) {
    const serialized = JSON.stringify(data)

    for (const [client, clientRoom] of this.clients) {
      if (clientRoom === channel && client.readyState === WebSocket.OPEN) {
        client.send(serialized)
      }
    }
  }
}
