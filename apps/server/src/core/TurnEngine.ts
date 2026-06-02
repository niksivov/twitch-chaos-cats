import { Match } from "./Match"

export class TurnEngine {
  startTurn(match: Match) {
    const activePlayers = match.getActivePlayers()
    if (activePlayers.length === 0) return

    if (!match.currentPlayerId) {
      const firstPlayer = activePlayers[0]
      if (!firstPlayer) return

      match.setCurrentPlayer(firstPlayer.id)
      this.initializeTurnTimer(match)
      return
    }

    const currentIndex = activePlayers.findIndex(
      (player) => player.id === match.currentPlayerId
    )

    if (currentIndex === -1) {
      const firstPlayer = activePlayers[0]
      if (!firstPlayer) return

      match.setCurrentPlayer(firstPlayer.id)
      this.initializeTurnTimer(match)
      return
    }

    const nextIndex = (currentIndex + 1) % activePlayers.length
    const nextPlayer = activePlayers[nextIndex]
    if (!nextPlayer) return

    match.setCurrentPlayer(nextPlayer.id)
    this.initializeTurnTimer(match)
  }

  update(match: Match) {
    const turnEndsAt = match.state.turnEndsAt
    if (turnEndsAt === null) return

    const now = Date.now()
    if (now < turnEndsAt) return

    match.markCurrentPlayerAsPlayed()
    this.startTurn(match)
  }

  private initializeTurnTimer(match: Match) {
    const now = Date.now()
    match.state.turnStartedAt = now

    // Берем таймер из state, либо дефолт 15 секунд
    const turnTimeSeconds = (match.state as any).turnTimeSeconds ?? 15
    match.state.turnEndsAt = now + turnTimeSeconds * 1000

    match.state.turnResolvedAt = null
  }
}