/**
 * GameEventEmitter — система событий в реальном времени (pub/sub).
 *
 * ⚠️ Сейчас не используется в основной игровой цепочке.
 * Он существует как заготовка для будущей архитектуры событий.
 *
 * Может быть подключён позже для:
 * - отправки событий в UI без polling (реактивное обновление)
 * - интеграции с Twitch-реакциями и чат-алертами
 * - систем триггеров внутри игры (эффекты, достижения)
 * - разделения логики игры и отображения
 *
 * На данный момент события пишутся через EventLog (match.state.eventLog).
 */
import { GameEvent } from "./GameEvent"

type Listener = (
  event: GameEvent
) => void

export class GameEventEmitter {
  private listeners: Listener[] = []

  emit(event: GameEvent) {
    for (const listener of this.listeners) {
      listener(event)
    }
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener)

    return () => {
      this.listeners =
        this.listeners.filter((l) => {
          return l !== listener
        })
    }
  }
}