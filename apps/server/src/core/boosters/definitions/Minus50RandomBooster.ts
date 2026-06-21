import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus50RandomBooster: BoosterDefinition =
  {
    id: "MINUS_50_RANDOM",

    name:
      "-50 случайному противнику",

    description:
      "Remove 50 points from random enemy",

    poolCount: 20,

    icon: "minus50random",

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
              player.playerId !==
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

      randomTarget.score -= 50
    },
  }