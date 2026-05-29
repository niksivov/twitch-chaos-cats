import { randomUUID } from "crypto"

export interface PlayerSession {
  playerId: string

  username: string

  matchId: string

  matchRuntimeId: string

  playerRuntimeId: string

  connected: boolean

  connectedAt: number

  disconnectedAt: number | null
}

export class SessionManager {
  private sessions =
    new Map<
      string,
      PlayerSession
    >()

  createSession(
    playerId: string,

    username: string,

    matchId: string,

    matchRuntimeId: string,

    playerRuntimeId: string
  ): PlayerSession {
    const existing =
      this.sessions.get(
        playerId
      )

    if (existing) {
      existing.username =
        username

      existing.matchId =
        matchId

      existing.matchRuntimeId =
        matchRuntimeId

      existing.playerRuntimeId =
        playerRuntimeId

      existing.connected =
        true

      existing.connectedAt =
        Date.now()

      existing.disconnectedAt =
        null

      return existing
    }

    const session: PlayerSession =
      {
        playerId,

        username,

        matchId,

        matchRuntimeId,

        playerRuntimeId,

        connected: true,

        connectedAt:
          Date.now(),

        disconnectedAt:
          null,
      }

    this.sessions.set(
      playerId,

      session
    )

    return session
  }

  getSession(
    playerId: string
  ): PlayerSession | null {
    return (
      this.sessions.get(
        playerId
      ) ?? null
    )
  }

  disconnect(
    playerId: string
  ): void {
    const session =
      this.sessions.get(
        playerId
      )

    if (!session) {
      return
    }

    session.connected = false

    session.disconnectedAt =
      Date.now()
  }

  reconnect(
    playerId: string
  ): PlayerSession | null {
    const session =
      this.sessions.get(
        playerId
      )

    if (!session) {
      return null
    }

    session.connected = true

    session.disconnectedAt =
      null

    return session
  }

  removeSession(
    playerId: string
  ): void {
    this.sessions.delete(
      playerId
    )
  }

  rotatePlayerRuntime(
    playerId: string
  ): string | null {
    const session =
      this.sessions.get(
        playerId
      )

    if (!session) {
      return null
    }

    session.playerRuntimeId =
      randomUUID()

    return (
      session.playerRuntimeId
    )
  }

  rotateMatchPlayerRuntimes(
    matchId: string
  ): void {
    for (const session of this
      .sessions.values()) {
      if (
        session.matchId ===
        matchId
      ) {
        session.playerRuntimeId =
          randomUUID()

        session.connected =
          false

        session.disconnectedAt =
          Date.now()
      }
    }
  }

  updateMatchRuntime(
    matchId: string,

    runtimeId: string
  ): void {
    for (const session of this
      .sessions.values()) {
      if (
        session.matchId ===
        matchId
      ) {
        session.matchRuntimeId =
          runtimeId
      }
    }
  }

  removeMatchSessions(
    matchId: string
  ): void {
    for (const [
      playerId,
      session,
    ] of this.sessions) {
      if (
        session.matchId ===
        matchId
      ) {
        this.sessions.delete(
          playerId
        )
      }
    }
  }
}