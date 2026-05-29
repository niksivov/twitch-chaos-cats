import { randomUUID } from "crypto"

const HEARTBEAT_TIMEOUT_MS =
  15000

export interface StreamerSessionState {
  channel: string

  sessionId: string

  connected: boolean

  connectedAt: number

  disconnectedAt: number | null

  lastHeartbeatAt: number
}

export class StreamerSession {
  private sessions =
    new Map<
      string,
      StreamerSessionState
    >()

  connect(
    channel: string
  ): StreamerSessionState {
    const now = Date.now()

    const existing =
      this.sessions.get(
        channel
      )

    if (existing) {
      existing.connected = true

      existing.connectedAt =
        now

      existing.disconnectedAt =
        null

      existing.lastHeartbeatAt =
        now

      existing.sessionId =
        randomUUID()

      return existing
    }

    const session: StreamerSessionState =
      {
        channel,

        sessionId:
          randomUUID(),

        connected: true,

        connectedAt: now,

        disconnectedAt:
          null,

        lastHeartbeatAt:
          now,
      }

    this.sessions.set(
      channel,
      session
    )

    return session
  }

  heartbeat(
    channel: string,

    sessionId: string
  ): boolean {
    const session =
      this.sessions.get(
        channel
      )

    if (!session) {
      return false
    }

    const valid =
      session.connected &&
      session.sessionId ===
        sessionId

    if (!valid) {
      return false
    }

    session.lastHeartbeatAt =
      Date.now()

    return true
  }

  disconnect(
    channel: string
  ): void {
    const session =
      this.sessions.get(
        channel
      )

    if (!session) {
      return
    }

    session.connected = false

    session.disconnectedAt =
      Date.now()
  }

  getSession(
    channel: string
  ): StreamerSessionState | null {
    return (
      this.sessions.get(
        channel
      ) ?? null
    )
  }

  validateSession(
    channel: string,

    sessionId: string
  ): boolean {
    const session =
      this.sessions.get(
        channel
      )

    if (!session) {
      return false
    }

    const alive =
      Date.now() -
        session.lastHeartbeatAt <
      HEARTBEAT_TIMEOUT_MS

    if (!alive) {
      session.connected =
        false

      session.disconnectedAt =
        Date.now()

      return false
    }

    return (
      session.connected &&
      session.sessionId ===
        sessionId
    )
  }

  invalidate(
    channel: string
  ): void {
    const session =
      this.sessions.get(
        channel
      )

    if (!session) {
      return
    }

    session.sessionId =
      randomUUID()

    session.connected = false

    session.disconnectedAt =
      Date.now()
  }

  remove(
    channel: string
  ): void {
    this.sessions.delete(
      channel
    )
  }
}