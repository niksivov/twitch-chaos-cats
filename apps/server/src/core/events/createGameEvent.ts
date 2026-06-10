/**
 * Создаёт объект GameEvent в едином формате.
 *
 * ⚠️ На данный момент не используется в основной игровой цепочке.
 * Оставлен как заготовка для возможной событийной архитектуры.
 *
 * Может быть использован в будущем для:
 * - создания типизированных игровых событий;
 * - передачи событий через GameEventEmitter;
 * - формирования UI-логов и уведомлений;
 * - аналитики, реплеев и других систем, работающих с событиями.
 */
import { GameEvent } from "./GameEvent"

export function createGameEvent(
  type: string,
  text: string
): GameEvent {
  return {
    id: crypto.randomUUID(),

    type,

    text,

    createdAt: Date.now(),
  }
}