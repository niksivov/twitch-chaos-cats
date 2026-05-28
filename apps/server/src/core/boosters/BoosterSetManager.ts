import { Match } from "../Match"

import { BoosterRegistry } from "./BoosterRegistry"

export class BoosterSetManager {
  private boosterRegistry =
    new BoosterRegistry()

  initialize(match: Match) {
    const targetSize =
      match.state.settings
        .boosterSetSize

    while (
      match.state.boosterSet.length <
      targetSize
    ) {
      this.addRandomBooster(
        match
      )
    }
  }

  replaceSlot(
    match: Match,
    slot: number
  ) {
    match.state.boosterSet =
      match.state.boosterSet.filter(
        (item) => {
          return item.slot !== slot
        }
      )

    this.addRandomBooster(
      match,
      slot
    )
  }

  private addRandomBooster(
    match: Match,
    forcedSlot?: number
  ) {
    const booster =
      this.boosterRegistry.getRandom()

    const usedSlots =
      match.state.boosterSet.map(
        (item) => item.slot
      )

    let slot =
      forcedSlot ?? 1

    if (!forcedSlot) {
      while (
        usedSlots.includes(slot)
      ) {
        slot++
      }
    }

    match.state.boosterSet.push({
      slot,

      boosterId: booster.id,

      boosterName: booster.name,
    })
  }
}