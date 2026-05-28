import { Match } from "../Match"

import { GameEvent } from "./GameEvent"

export class MatchEventStore {
  attach(match: Match, event: GameEvent) {
    match.state.recentEvents.unshift({
      id: event.id,

      text: event.text,

      createdAt: event.createdAt,
    })

    match.state.recentEvents =
      match.state.recentEvents.slice(0, 10)
  }
}