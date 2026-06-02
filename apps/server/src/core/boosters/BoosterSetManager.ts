import { Match } from "../Match"
import { BoosterRegistry } from "./BoosterRegistry"

export interface BoosterSetItem {
  slot: number
  boosterId: string
  boosterName: string
  boosterIcon: string
}

export class BoosterSetManager {
  private boosterRegistry = new BoosterRegistry()

  initialize(match: Match) {
    if (match.state.boosterPool.length === 0) {
      this.fillBoosterPool(match)
    }

    match.state.boosterSet = []

    const setSize =
      (match.state as any)
        .boosterSetSize ?? 3

    for (
      let i = 1;
      i <= setSize;
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
        booster.poolCount

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
      const exhaustiblePool =
        (match.state as any)
          .exhaustiblePool ??
        true

      if (!exhaustiblePool) {
        return
      }

      this.fillBoosterPool(
        match
      )
    }

    const boosterId =
      match.state.boosterPool.shift()

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
        boosterIcon:
          booster.icon,
      }

    if (
      existingIndex === -1
    ) {
      match.state.boosterSet.push(
        setItem
      )
    } else {
      match.state.boosterSet[
        existingIndex
      ] = setItem
    }
  }

  removeSlot(
    match: Match,
    slot: number
  ) {
    match.state.boosterSet =
      match.state.boosterSet.filter(
        (item) =>
          item.slot !== slot
      )
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
      const j = Math.floor(
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