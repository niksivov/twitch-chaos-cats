import { ServerWebSocket } from "bun"

import { Match } from "../core/Match"

import { StreamerSession } from "../core/StreamerSession"

import {
  WS_EVENTS,
  WsMessage,
  MatchStatePayload,
} from "./wsEvents"

interface ClientData {
  channel: string

  sessionId: string
}

export class GameBroadcaster {
  private clients =
    new Set<
      ServerWebSocket<ClientData>
    >()

  constructor(
    private streamerSession: StreamerSession
  ) {
    setInterval(() => {
      this.validateClients()
    }, 5000)

    setInterval(() => {
      this.pingClients()
    }, 5000)
  }

  addClient(
    ws: ServerWebSocket<ClientData>
  ) {
    const data = ws.data

    if (!data) {
      ws.close()

      return
    }

    const valid =
      this.streamerSession.validateSession(
        data.channel,
        data.sessionId
      )

    if (!valid) {
      ws.close()

      return
    }

    this.clients.add(ws)
  }

  removeClient(
    ws: ServerWebSocket<ClientData>
  ) {
    this.clients.delete(ws)

    const data = ws.data

    if (!data?.channel) {
      return
    }

    const activeSession =
      this.streamerSession.getSession(
        data.channel
      )

    if (!activeSession) {
      return
    }

    const sameSession =
      activeSession.sessionId ===
      data.sessionId

    if (!sameSession) {
      return
    }

    this.streamerSession.disconnect(
      data.channel
    )
  }

  validateClient(
    ws: ServerWebSocket<ClientData>
  ): boolean {
    const data = ws.data

    if (!data) {
      ws.close()

      return false
    }

    const valid =
      this.streamerSession.validateSession(
        data.channel,
        data.sessionId
      )

    if (!valid) {
      ws.close()

      this.clients.delete(ws)

      return false
    }

    return true
  }

  private validateClients() {
    for (const client of this
      .clients) {
      this.validateClient(
        client
      )
    }
  }

  private pingClients() {
    const payload: WsMessage<
      typeof WS_EVENTS.PING
    > = {
      type: WS_EVENTS.PING,
    }

    const encoded =
      JSON.stringify(payload)

    for (const client of this
      .clients) {
      const valid =
        this.validateClient(
          client
        )

      if (!valid) {
        continue
      }

      client.send(encoded)
    }
  }

  broadcastMatchState(
    match: Match
  ) {
    const payload: WsMessage<
      typeof WS_EVENTS.MATCH_STATE,
      MatchStatePayload
    > = {
      type:
        WS_EVENTS.MATCH_STATE,

      payload: {
        match,
      },
    }

    const encoded =
      JSON.stringify(payload)

    for (const client of this
      .clients) {
      const valid =
        this.validateClient(
          client
        )

      if (!valid) {
        continue
      }

      client.send(encoded)
    }
  }
}