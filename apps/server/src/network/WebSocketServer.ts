import {
  WebSocketServer as WSServer,

  WebSocket,
} from "ws"

import { MatchManager } from "../core/MatchManager"

import { CommandProcessor } from "../core/CommandProcessor"

export class GameWebSocketServer {
  private wss: WSServer

  private clients =
    new Set<WebSocket>()

  constructor(
    port: number,

    private readonly matchManager: MatchManager,

    private readonly commandProcessor: CommandProcessor
  ) {
    this.wss = new WSServer({
      port,
    })

    this.initialize()
  }

  private initialize() {
    this.wss.on(
      "connection",

      (socket: WebSocket) => {
        console.log(
          "websocket client connected"
        )

        this.clients.add(socket)

        socket.on(
          "close",

          () => {
            this.clients.delete(
              socket
            )

            const matchId = (
              socket as any
            ).matchId

            const playerId = (
              socket as any
            ).playerId

            if (
              matchId &&
              playerId
            ) {
              this.matchManager.disconnectPlayer(
                matchId,

                playerId
              )
            }

            console.log(
              "websocket client disconnected"
            )
          }
        )

        socket.on(
          "message",

          (raw) => {
            try {
              const message =
                JSON.parse(
                  raw.toString()
                )

              this.handleMessage(
                socket,

                message
              )
            } catch (error) {
              console.error(
                "[WebSocket] invalid message",

                error
              )
            }
          }
        )
      }
    )
  }

  private handleMessage(
    socket: WebSocket,

    message: any
  ) {
    switch (message.type) {
      case "JOIN_MATCH":
        this.handleJoinMatch(
          socket,

          message
        )
        break

      case "SELECT_BOOSTER":
        this.handleSelectBooster(
          socket,

          message
        )
        break
    }
  }

  private handleJoinMatch(
    socket: WebSocket,

    message: any
  ) {
    const {
      matchId,

      playerId,

      username,
    } = message.data

    const match =
      this.matchManager.joinPlayer(
        matchId,

        playerId,

        username
      )

    ;(
      socket as any
    ).matchId = match.id

    ;(
      socket as any
    ).playerId = playerId

    socket.send(
      JSON.stringify({
        type: "JOINED_MATCH",

        data: {
          matchId:
            match.id,

          playerId,
        },
      })
    )
  }

  private handleSelectBooster(
    socket: WebSocket,

    message: any
  ) {
    const matchId = (
      socket as any
    ).matchId

    const playerId = (
      socket as any
    ).playerId

    if (
      !matchId ||
      !playerId
    ) {
      return
    }

    this.commandProcessor.enqueue(
      {
        type:
          "SELECT_BOOSTER",

        matchId,

        playerId,

        payload:
          message.data,

        createdAt:
          Date.now(),
      }
    )
  }

  broadcast(data: any) {
    const serialized =
      JSON.stringify(data)

    for (const client of this
      .clients) {
      if (
        client.readyState ===
        WebSocket.OPEN
      ) {
        client.send(serialized)
      }
    }
  }
}