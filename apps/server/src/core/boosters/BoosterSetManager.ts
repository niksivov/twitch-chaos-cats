import { Match } from "../Match"

import { BoosterRegistry } from "./BoosterRegistry"

export interface BoosterSetItem {
  slot: number

  boosterId: string

  boosterName: string
}

const BOOSTER_SET_SIZE = 3

export class BoosterSetManager {
  private boosterRegistry =
    new BoosterRegistry()

  initialize(match: Match) {
    if (
      match.state.boosterPool
        .length === 0
    ) {
      this.fillBoosterPool(
        match
      )
    }

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

  private fillBoosterPool(
    match: Match
  ) {
    const boosters =
      this.boosterRegistry.getAll()

    const pool: string[] = []

    for (const booster of boosters) {
      const copies =
        Math.max(
          1,
          10 - booster.rarity
        )

      for (
        let i = 0;
        i < copies;
        i++
      ) {
        pool.push(
          booster.id
        )
      }
    }

    this.shuffle(pool)

    match.state.boosterPool =
      pool
  }

  replaceSlot(
    match: Match,

    slot: number
  ) {
    if (
      match.state.boosterPool
        .length === 0
    ) {
      this.fillBoosterPool(
        match
      )
    }

    const boosterId =
      match.state
        .boosterPool.shift()

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

        boosterName:
          booster.name,
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
  }

  private shuffle(
    array: string[]
  ) {
    for (
      let i =
        array.length - 1;
      i > 0;
      i--
    ) {
      const j =
        Math.floor(
          Math.random() *
            (i + 1)
        )

      ;[
        array[i],
        array[j],
      ] = [
        array[j],
        array[i],
      ]
    }
  }
}