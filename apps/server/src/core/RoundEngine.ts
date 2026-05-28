import { Match } from "./Match"

export class RoundEngine {
  private turnsPerRound = 5

  process(match: Match) {
    const state = match.state

    if (state.phase !== "MAIN_LOOP") {
      return
    }

    if (
      state.tick %
        this.turnsPerRound !==
      0
    ) {
      return
    }

    state.round++
  }
}