import { Match } from "./Match"
import { MatchPhase } from "./matchPhase"
import { BoosterEngine } from "./boosters/BoosterEngine"

export class TurnTimerEngine {
  private boosterEngine = new BoosterEngine() // подключаем существующий BoosterEngine

  process(match: Match) {
    // таймер работает только во время выбора бустера
    if (match.phase !== MatchPhase.BOOSTER_SELECTION) {
      return
    }

    // если уже есть результат хода — ничего не делаем
    if (match.state.turnResolvedAt !== null) {
      return
    }

    // если таймер не установлен — выходим
    if (!match.state.turnEndsAt) {
      return
    }

    const now = Date.now()

    // ещё не время срабатывать
    if (now < match.state.turnEndsAt) {
      return
    }

    // фиксируем момент автозавершения
    match.state.turnResolvedAt = now

    this.activateRandomBooster(match)
  }

  private activateRandomBooster(match: Match) {
    const boosterSet = match.state.boosterSet
    if (boosterSet.length === 0) return
    if (!match.currentPlayerId) return

    const randomIndex = Math.floor(Math.random() * boosterSet.length)
    const randomItem = boosterSet[randomIndex]
    if (!randomItem) return

    // вызываем BoosterEngine, чтобы эффекты реально применились
    this.boosterEngine.activateBooster(match, match.currentPlayerId, randomItem.slot)

    // фиксируем, что игрок сделал ход
    match.markCurrentPlayerAsPlayed()

    // переводим фазу в разрешение бустера
    match.transition(MatchPhase.BOOSTER_RESOLUTION)
  }
}