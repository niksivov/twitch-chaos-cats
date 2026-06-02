import { randomUUID } from "crypto"
import { Match } from "./Match"
import { SessionManager } from "./SessionManager"
import { MatchSettings } from "./MatchSettings"

export class MatchManager {
  private matches = new Map<string, Match>()

  constructor(private sessionManager: SessionManager) {}

  createMatch(settings?: Partial<MatchSettings>): Match {
    const matchId = randomUUID()
    const match = new Match(matchId, settings)
    this.matches.set(matchId, match)
    return match
  }

  getMatch(matchId: string): Match | null {
    return this.matches.get(matchId) ?? null
  }

  getAllMatches(): Match[] {
    return Array.from(this.matches.values())
  }

  removeMatch(matchId: string): void {
    this.sessionManager.removeMatchSessions(matchId)
    this.matches.delete(matchId)
  }

  addPlayerToMatch(matchId: string, playerId: string, username: string) {
    const match = this.matches.get(matchId)
    if (!match) throw new Error("Match not found")

    const player = match.addPlayer(playerId, username)

    this.sessionManager.createSession(
      player.id,
      player.username,
      match.id,
      match.state.runtimeId,
      player.runtimeId
    )

    return { match, player }
  }

  disconnectPlayer(matchId: string, playerId: string): void {
    const match = this.matches.get(matchId)
    if (!match) return

    match.disconnectPlayer(playerId)
    this.sessionManager.disconnect(playerId)
  }

  reconnectPlayer(playerId: string): boolean {
    const session = this.sessionManager.getSession(playerId)
    if (!session) return false

    const match = this.matches.get(session.matchId)
    if (!match) return false

    const success = match.reconnectPlayer(
      playerId,
      session.matchRuntimeId,
      session.playerRuntimeId
    )

    if (!success) return false

    this.sessionManager.reconnect(playerId)
    return true
  }

  cleanupEmptyMatches(): void {
    for (const [matchId, match] of this.matches) {
      if (match.players.length === 0 && match.phase === "WAITING_FOR_PLAYERS") {
        this.removeMatch(matchId)
      }
    }
  }

  syncMatchRuntime(matchId: string): void {
    const match = this.matches.get(matchId)
    if (!match) return
    this.sessionManager.updateMatchRuntime(matchId, match.state.runtimeId)
  }
}