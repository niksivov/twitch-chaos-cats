export interface PlayerSession {
  playerId: string

  roomId: string

  connected: boolean

  lastSeenAt: number
}

export class SessionManager {
  private sessions =
    new Map<string, PlayerSession>()

  private reconnectGraceMs =
    15000

  connect(
    roomId: string,
    playerId: string
  ) {
    this.sessions.set(playerId, {
      playerId,

      roomId,

      connected: true,

      lastSeenAt: Date.now(),
    })
  }

  disconnect(playerId: string) {
    const session =
      this.sessions.get(playerId)

    if (!session) {
      return
    }

    session.connected = false

    session.lastSeenAt =
      Date.now()
  }

  heartbeat(playerId: string) {
    const session =
      this.sessions.get(playerId)

    if (!session) {
      return
    }

    session.connected = true

    session.lastSeenAt =
      Date.now()
  }

  isConnected(
    playerId: string
  ): boolean {
    const session =
      this.sessions.get(playerId)

    if (!session) {
      return false
    }

    if (session.connected) {
      return true
    }

    const elapsed =
      Date.now() -
      session.lastSeenAt

    return (
      elapsed <
      this.reconnectGraceMs
    )
  }
}