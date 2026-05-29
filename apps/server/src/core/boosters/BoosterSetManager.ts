import { Match } from "../Match"

import { BoosterRegistry } from "./BoosterRegistry"

export interface BoosterSetItem {
  slot: number

  boosterId: string
}

const BOOSTER_SET_SIZE = 3

export class BoosterSetManager {
  private boosterRegistry =
    new BoosterRegistry()

  initialize(match: Match) {
    match.state.boosterSet =
      []

    for (
      let i = 0;
      i < BOOSTER_SET_SIZE;
      i++
    ) {
      this.replaceSlot(
        match,
        i
      )
    }
  }

  replaceSlot(
    match: Match,

    slot: number
  ) {
    const pool =
      match.state.boosterPool

    if (pool.length === 0) {
      return
    }

    const randomIndex =
      Math.floor(
        Math.random() *
          pool.length
      )

    const boosterId =
      pool[randomIndex]

    if (!boosterId) {
      return
    }

    const booster =
      this.boosterRegistry.getById(
        boosterId
      )

    if (!booster) {
      return
    }

    const existingIndex =
      match.state.boosterSet.findIndex(
        (item) =>
          item.slot === slot
      )

    const setItem: BoosterSetItem =
      {
        slot,

        boosterId,
      }

    if (existingIndex === -1) {
      match.state.boosterSet.push(
        setItem
      )
    } else {
      match.state.boosterSet[
        existingIndex
      ] = setItem
    }

    pool.splice(
      randomIndex,
      1
    )
  }
}