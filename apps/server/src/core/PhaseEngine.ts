import { Match } from "./Match"

import { MatchPhase } from "./matchPhase"

export class PhaseEngine {
  process(match: Match) {
    switch (match.phase) {
      case MatchPhase.WAITING_FOR_PLAYERS:
        return

      case MatchPhase.STARTING:
        return

      case MatchPhase.ROUND_START:
        return

      case MatchPhase.TURN_START:
        return

      case MatchPhase.BOOSTER_SELECTION:
        return

      case MatchPhase.BOOSTER_RESOLUTION:
        return

      case MatchPhase.TURN_END:
        return

      case MatchPhase.ROUND_END:
        return

      case MatchPhase.MATCH_END:
        return

      case MatchPhase.RESETTING:
        return
    }
  }

  isGameplayPhase(
    match: Match
  ): boolean {
    return [
      MatchPhase.ROUND_START,

      MatchPhase.TURN_START,

      MatchPhase.BOOSTER_SELECTION,

      MatchPhase.BOOSTER_RESOLUTION,

      MatchPhase.TURN_END,

      MatchPhase.ROUND_END,
    ].includes(match.phase)
  }

  isFinished(
    match: Match
  ): boolean {
    return (
      match.phase ===
      MatchPhase.MATCH_END
    )
  }

  canAcceptInputs(
    match: Match
  ): boolean {
    return (
      match.phase ===
      MatchPhase.BOOSTER_SELECTION
    )
  }
}