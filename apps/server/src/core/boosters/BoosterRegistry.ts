import {
  BoosterDefinition,
} from "./BoosterTypes"

import {
  ALL_BOOSTERS,
} from "./definitions"

export class BoosterRegistry {
  private boosters =
    new Map<
      string,
      BoosterDefinition
    >()

  constructor() {
    for (const booster of ALL_BOOSTERS) {
      this.register(
        booster
      )
    }
  }

  register(
    booster: BoosterDefinition
  ) {
    this.boosters.set(
      booster.id,
      booster
    )
  }

  getAll(): BoosterDefinition[] {
    return [
      ...this.boosters.values(),
    ]
  }

  getById(
    id: string
  ):
    | BoosterDefinition
    | undefined {
    return this.boosters.get(id)
  }
}