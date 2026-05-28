import {
  ServerMessage,
  StateUpdatePayload,
} from "@twitch-chaos-cats/shared-types"

import { Match } from "../core/Match"

import { GameWebSocketServer } from "./WebSocketServer"

import { createStateSnapshot } from "./snapshot"

export class GameBroadcaster {
  constructor(
    private websocketServer: GameWebSocketServer
  ) {}

  broadcastMatchState(match: Match) {
    const payload: StateUpdatePayload =
      createStateSnapshot(match)

    const message: ServerMessage<StateUpdatePayload> =
      {
        type: "STATE_UPDATE",

        payload,
      }

    this.websocketServer.broadcast(message)
  }
}