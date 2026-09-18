import { Match } from "../Match"
import { BoosterRegistry } from "./BoosterRegistry"
import { BoosterSetManager } from "./BoosterSetManager"
import { EventLog } from "../events/EventLog"
import { snapshotPlayers, describeStateChanges } from "../events/logStateChanges"
import { EffectEngine } from "../effects/EffectEngine"

export class BoosterEngine {
  private boosterRegistry = new BoosterRegistry()
  private boosterSetManager = new BoosterSetManager()
  private eventLog = new EventLog()
  private effectEngine = new EffectEngine()

  initialize(match: Match) {
    // Инициализация набора бустеров по настройкам матча
    this.boosterSetManager.initialize(match)
  }

  activateBooster(match: Match, playerId: string, slot: number) {
    const setItem = match.state.boosterSet.find(item => item.slot === slot)
    if (!setItem) return

    const booster = this.boosterRegistry.getById(setItem.boosterId)
    if (!booster) return

    const player = match.state.registeredPlayers[playerId]
    if (!player) return

    const before = snapshotPlayers(match)

    // Выполнение эффекта бустера
    booster.execute({
      match,
      sourcePlayerId: playerId,
    })

    this.applyEffects(match, playerId)

    const fragments = describeStateChanges(match, before)

    const ruParts = [`⚡ ${player.username} активирует ${booster.name}`]
    const enParts = [`⚡ ${player.username} activates ${booster.nameEn}`]

    // Лог результата колеса
    if (booster.id === "WHEEL" && match.state.wheelResult) {
      const winner = match.state.registeredPlayers[match.state.wheelResult.winnerId]
      if (winner) {
        ruParts.push(`🎡 ${winner.username} выигрывает колесо!`)
        enParts.push(`🎡 ${winner.username} wins the wheel!`)
      }
    }

    // Одна строка: активация + результаты
    this.eventLog.add(
      match,
      [...ruParts, ...fragments.ru].join(" "),
      [...enParts, ...fragments.en].join(" "),
      playerId
    )

    // Удаляем слот из набора
    this.boosterSetManager.removeSlot(match, slot)

    // Обновляем текущий выбранный бустер
    match.state.selectedBooster = {
      boosterId: booster.id,
      sourcePlayerId: playerId,
      slot,
      activatedAt: Date.now(),
    }
  }

  private applyEffects(match: Match, playerId: string) {
    const effects = this.effectEngine.getPlayerEffects(match, playerId)
    for (const effect of effects) {
      switch (effect.type) {
        case "DOUBLE_POINTS":
          this.applyDoublePoints(match, playerId)
          break
        // можно добавить новые типы эффектов
      }
    }
  }

  private applyDoublePoints(match: Match, playerId: string) {
    const player = match.state.registeredPlayers[playerId]
    if (!player) return
    player.score *= 2
  }
}