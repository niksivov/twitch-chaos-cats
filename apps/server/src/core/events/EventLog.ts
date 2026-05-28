import { Match } from "../Match"

export class EventLog {
  add(
    match: Match,
    text: string
  ) {
    match.state.recentEvents.unshift(
      {
        id:
          Date.now().toString() +
          Math.random()
            .toString(36)
            .slice(2),

        text,

        createdAt: Date.now(),
      }
    )

    match.state.recentEvents =
      match.state.recentEvents.slice(
        0,
        5
      )
  }
}