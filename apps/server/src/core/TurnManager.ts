import { Match } from "./Match"
import { MatchPhase } from "./matchPhase"

export class TurnManager {
  private matchTurnManagers: Map<string, string[]> = new Map()

  /**
   * Теперь ONLY инициализирует очередь и таймер.
   * НЕ выбирает игрока сам.
   */
  startRound(match: Match) {
    const alivePlayers = match.getAlivePlayers()

    if (alivePlayers.length === 0) {
      match.currentPlayerId = null
      return
    }

    // 🔹 очередь теперь internalId (пересобирается каждый старт хода)
    this.matchTurnManagers.set(
      match.id,
      Object.entries(match.state.registeredPlayers)
        .filter(([_, p]) => p.isAlive)
        .sort((a, b) => a[1].score - b[1].score)
        .map(([internalId]) => internalId)
    )
    match.turnOrder = this.matchTurnManagers.get(match.id) ?? []
    match.state.roundPlayedPlayerIds = []

    this.initializeTurnTimer(match)
  }

  /**
   * Проверяет таймер, но НЕ завершает ход.
   * Только сигнализирует GameLoop.
   */
  processTimer(match: Match): "EXPIRED" | false {
    if (match.phase !== MatchPhase.BOOSTER_SELECTION) return false
    if (!match.state.turnEndsAt) return false
    if (match.state.turnResolvedAt !== null) return false

    const now = Date.now()
    if (now < match.state.turnEndsAt) return false

    match.state.turnResolvedAt = now
    return "EXPIRED"
  }

  /**
   * Теперь только помечает игрока как сыгравшего.
   */
  endTurn(match: Match) {
    if (!match.currentPlayerId) return

    const internalId = match.currentPlayerId

    if (!match.state.roundPlayedPlayerIds.includes(internalId)) {
      match.state.roundPlayedPlayerIds.push(internalId)
    }
  }

  getCurrentPlayer(match: Match) {
    if (!match.currentPlayerId) return null
    return match.state.registeredPlayers[match.currentPlayerId] ?? null
  }

  /**
   * Чистая логика проверки
   */
  isRoundFinished(match: Match): boolean {
    const alivePlayers = match.getAlivePlayers()

    return alivePlayers.every(player => {
      const internalId = match.getPlayerIdByTwitchId(player.twitchUserId)
      return internalId
        ? match.state.roundPlayedPlayerIds.includes(internalId)
        : false
    })
  }

  /**
   * Больше НЕ управляет state
   * только возвращает данные
   */
  getNextPlayerId(match: Match): string | null {
    const alivePlayers = match.getAlivePlayers()
    if (alivePlayers.length === 0) return null

    const roundPlayed = match.state.roundPlayedPlayerIds
    const queue = this.matchTurnManagers.get(match.id) ?? []

    let nextPlayerId = queue.find(id => !roundPlayed.includes(id))
    if (!nextPlayerId) {
      nextPlayerId = queue[0] ?? null
    }

    return nextPlayerId
  }

  getRemainingSeconds(match: Match): number {
    if (!match.state.turnEndsAt) return 0
    const diff = match.state.turnEndsAt - Date.now()
    return Math.max(0, Math.ceil(diff / 1000))
  }

  resetTimer(match: Match) {
    match.state.turnStartedAt = null
    match.state.turnEndsAt = null
    match.state.turnResolvedAt = null
  }

  private initializeTurnTimer(match: Match) {
    const now = Date.now()
    const turnTimeSeconds = match.state.turnTimeSeconds ?? 15

    match.state.turnStartedAt = now
    match.state.turnEndsAt = now + turnTimeSeconds * 1000
    match.state.turnResolvedAt = null
  }
}