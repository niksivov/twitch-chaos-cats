import {
  BoosterDefinition,
} from "../BoosterTypes"

import {
  Plus20Booster,
} from "./Plus20Booster"

import {
  Plus50Booster,
} from "./Plus50Booster"

import {
  Minus30RandomBooster,
} from "./Minus30RandomBooster"

import {
  DoubleSelfBooster,
} from "./DoubleSelfBooster"

import {
  RandomRemoveBooster,
} from "./RandomRemoveBooster"

export const ALL_BOOSTERS: BoosterDefinition[] =
  [
    Plus20Booster,

    Plus50Booster,

    Minus30RandomBooster,

    DoubleSelfBooster,

    RandomRemoveBooster,
  ]