import { Match } from "../core/Match"

import { GameWebSocketServer } from "./WebSocketServer"

export class GameBroadcaster {
  constructor(
    private readonly websocketServer: GameWebSocketServer
  ) {}

  broadcastMatchState(
    match: Match
  ) {
    this.websocketServer.broadcast({
      type: "match_state",

      payload: {
        match,
      },
    })
  }
}