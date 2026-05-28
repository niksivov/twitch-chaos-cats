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