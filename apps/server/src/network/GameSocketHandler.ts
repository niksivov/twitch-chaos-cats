import { ServerWebSocket } from "bun"

import { CommandProcessor } from "../core/CommandProcessor"

import { StreamerSession } from "../core/StreamerSession"

import { GameBroadcaster } from "./GameBroadcaster"

import {
  WS_EVENTS,
  WsMessage,
  isWsMessage,
  StreamerSessionPayload,
} from "./wsEvents"

interface ClientData {
  channel: string

  sessionId: string

  req?: Request
}

export class GameSocketHandler {
  constructor(
    private broadcaster: GameBroadcaster,

    private streamerSession: StreamerSession,

    private commandProcessor: CommandProcessor
  ) {}

  open(
    ws: ServerWebSocket<ClientData>
  ) {
    const url =
      new URL(
        ws.data
          ?.req
          ?.url ??
          "http://localhost"
      )

    const channel =
      url.searchParams.get(
        "channel"
      )

    if (!channel) {
      ws.close()

      return
    }

    const session =
      this.streamerSession.connect(
        channel
      )

    ws.data = {
      channel,

      sessionId:
        session.sessionId,
    }

    this.broadcaster.addClient(
      ws
    )

    const payload: WsMessage<
      typeof WS_EVENTS.STREAMER_SESSION,
      StreamerSessionPayload
    > = {
      type:
        WS_EVENTS.STREAMER_SESSION,

      payload: {
        channel,

        sessionId:
          session.sessionId,
      },
    }

    ws.send(
      JSON.stringify(payload)
    )
  }

  close(
    ws: ServerWebSocket<ClientData>
  ) {
    this.broadcaster.removeClient(
      ws
    )
  }

  message(
    ws: ServerWebSocket<ClientData>,

    rawMessage: string
  ) {
    const valid =
      this.broadcaster.validateClient(
        ws
      )

    if (!valid) {
      return
    }

    let parsed: unknown

    try {
      parsed =
        JSON.parse(rawMessage)
    } catch {
      return
    }

    if (
      !isWsMessage(parsed)
    ) {
      return
    }

    if (
      parsed.type ===
      WS_EVENTS.HEARTBEAT
    ) {
      this.handleHeartbeat(
        ws
      )

      return
    }

    this.commandProcessor.enqueue({
      type: parsed.type,

      payload:
        parsed.payload ?? {},
    })
  }

  private handleHeartbeat(
    ws: ServerWebSocket<ClientData>
  ) {
    const data = ws.data

    if (!data) {
      ws.close()

      return
    }

    const success =
      this.streamerSession.heartbeat(
        data.channel,
        data.sessionId
      )

    if (!success) {
      ws.close()

      return
    }

    const payload: WsMessage<
      typeof WS_EVENTS.HEARTBEAT_ACK
    > = {
      type:
        WS_EVENTS.HEARTBEAT_ACK,
    }

    ws.send(
      JSON.stringify(payload)
    )
  }
}