import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus100RandomBooster: BoosterDefinition =
  {
    id: "MINUS_100_RANDOM",

    name:
      "-100 Случайному противнику",

    description:
      "Remove 100 points from random enemy",

    poolCount: 1,

    icon: "minus100",

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

      randomTarget.score -= 100
    },
  }