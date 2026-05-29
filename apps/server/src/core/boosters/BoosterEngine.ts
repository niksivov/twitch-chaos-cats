import { Match } from "../Match"

import { MatchPhase } from "../matchPhase"

import { BoosterRegistry } from "./BoosterRegistry"

import { BoosterSetManager } from "./BoosterSetManager"

import { EventLog } from "../events/EventLog"

export class BoosterEngine {
  private boosterRegistry =
    new BoosterRegistry()

  private boosterSetManager =
    new BoosterSetManager()

  private eventLog =
    new EventLog()

  initialize(match: Match) {
    this.boosterSetManager.initialize(
      match
    )
  }

  activateBooster(
    match: Match,

    sourcePlayerId: string,

    slot: number
  ) {
    if (
      match.phase !==
      MatchPhase.BOOSTER_SELECTION
    ) {
      return
    }

    if (
      sourcePlayerId !==
      match.currentPlayerId
    ) {
      return
    }

    const setItem =
      match.state.boosterSet.find(
        (item) => {
          return (
            item.slot === slot
          )
        }
      )

    if (!setItem) {
      return
    }

    const booster =
      this.boosterRegistry.getById(
        setItem.boosterId
      )

    if (!booster) {
      return
    }

    const player =
      match.state.playersById[
        sourcePlayerId
      ]

    if (!player) {
      return
    }

    match.transition(
      MatchPhase.BOOSTER_RESOLUTION
    )

    booster.execute({
      match,

      sourcePlayerId,
    })

    this.eventLog.add(
      match,
      `${player.nickname} used ${booster.name}`
    )

    this.boosterSetManager.replaceSlot(
      match,
      slot
    )

    match.state.selectedBooster =
      {
        boosterId:
          booster.id,

        sourcePlayerId,

        slot,

        activatedAt:
          Date.now(),
      }

    match.transition(
      MatchPhase.TURN_END
    )
  }
}