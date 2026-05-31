import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus30RandomBooster: BoosterDefinition =
  {
    id: "MINUS_30_RANDOM",

    name:
      "-30 Случайному противнику",

    description:
      "Remove 30 points from random enemy",

    poolCount: 5,

    icon: "minus30",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      const targets =
        match
          .getAlivePlayers()
          .filter(
            (
              player: any
            ) =>
              player.id !==
              sourcePlayerId
          )

      if (
        targets.length === 0
      ) {
        return
      }

      const randomTarget =
        targets[
          Math.floor(
            Math.random() *
              targets.length
          )
        ]

      randomTarget.score -= 30
    },
  }