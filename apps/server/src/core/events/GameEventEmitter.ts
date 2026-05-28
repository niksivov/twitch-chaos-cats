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