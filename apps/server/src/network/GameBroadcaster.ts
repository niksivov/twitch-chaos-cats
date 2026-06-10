import { Match } from "../core/Match"
import { WebSocketServer } from "./WebSocketServer"

export class GameBroadcaster {
  constructor(
    private readonly websocketServer: WebSocketServer
  ) {}

  broadcastMatchState(match: Match) {
    this.websocketServer.broadcast({
      type: "match_state",
      payload: match.toJSON(),
    })
  }

  // 💣 ДОБАВИЛИ ЭТО
  broadcast(event: any) {
    this.websocketServer.broadcast(event)
  }
}