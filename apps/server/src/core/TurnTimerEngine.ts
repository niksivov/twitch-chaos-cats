import { Match } from "./Match"

import { MatchPhase } from "./matchPhase"

const TURN_DURATION_MS =
  15000

export class TurnTimerEngine {
  process(match: Match) {
    const now = Date.now()

    if (
      match.phase ===
      MatchPhase.TURN_START
    ) {
      match.state.turnStartedAt =
        now

      match.state.turnEndsAt =
        now + TURN_DURATION_MS

      return
    }

    if (
      match.phase !==
      MatchPhase.BOOSTER_SELECTION
    ) {
      return
    }

    if (
      !match.state.turnEndsAt
    ) {
      return
    }

    if (
      now <
      match.state.turnEndsAt
    ) {
      return
    }

    match.transition(
      MatchPhase.BOOSTER_RESOLUTION
    )
  }
}