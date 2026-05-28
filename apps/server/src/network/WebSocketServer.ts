import { WebSocketServer as WSServer, WebSocket } from "ws"

export class GameWebSocketServer {
  private wss: WSServer

  private clients = new Set<WebSocket>()

  constructor(port: number) {
    this.wss = new WSServer({
      port,
    })

    this.initialize()
  }

  private initialize() {
    this.wss.on("connection", (socket) => {
      console.log("websocket client connected")

      this.clients.add(socket)

      socket.on("close", () => {
        this.clients.delete(socket)

        console.log("websocket client disconnected")
      })

      socket.on("message", (message) => {
        console.log(message.toString())
      })
    })
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