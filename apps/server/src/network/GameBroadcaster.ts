import { Match } from "../core/Match"
import { WebSocketServer } from "./WebSocketServer"

export class GameBroadcaster {
  constructor(
    private readonly websocketServer: WebSocketServer
  ) {}

  broadcastMatchState(match: Match) {
    this.websocketServer.broadcast({
      type: "match_state",
      roomId: match.state.twitchChannel,
      payload: match.toJSON(),
    })
  }

  broadcast(event: any) {
    this.websocketServer.broadcast(event)
  }
}
