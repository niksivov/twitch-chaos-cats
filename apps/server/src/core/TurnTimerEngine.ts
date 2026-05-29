import { Match } from "./Match"

import { MatchPhase } from "./matchPhase"

import { BoosterEngine } from "./boosters/BoosterEngine"

export class TurnTimerEngine {
  private boosterEngine =
    new BoosterEngine()

  process(match: Match) {
    if (
      match.phase !==
      MatchPhase.BOOSTER_SELECTION
    ) {
      return
    }

    if (
      match.state
        .turnResolvedAt !==
      null
    ) {
      return
    }

    if (
      !match.state.turnEndsAt
    ) {
      return
    }

    const now = Date.now()

    if (
      now <
      match.state.turnEndsAt
    ) {
      return
    }

    match.state.turnResolvedAt =
      now

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

    match.transition(
      MatchPhase.BOOSTER_RESOLUTION
    )

    this.boosterEngine.activateBooster(
      match,

      match.currentPlayerId,

      randomSlot.slot
    )
  }
}