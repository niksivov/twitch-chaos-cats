import { Match } from "./Match"

import { MatchPhase } from "./matchPhase"

import { BoosterEngine } from "./boosters/BoosterEngine"

const TURN_DURATION_MS =
  15000

export class TurnTimerEngine {
  private boosterEngine =
    new BoosterEngine()

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

    this.activateRandomBooster(
      match
    )
  }

  private activateRandomBooster(
    match: Match
  ) {
    const boosterSet =
      match.state.boosterSet

    if (
      boosterSet.length === 0
    ) {
      return
    }

    const randomIndex =
      Math.floor(
        Math.random() *
          boosterSet.length
      )

    const randomSlot =
      boosterSet[randomIndex]

    if (!randomSlot) {
      return
    }

    if (
      !match.currentPlayerId
    ) {
      return
    }

    this.boosterEngine.activateBooster(
      match,

      match.currentPlayerId,

      randomSlot.slot
    )
  }
}