import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus25PercentRandomBooster: BoosterDefinition =
  {
    id: "MINUS_25_PERCENT_RANDOM",

    name:
      "-25% Random Enemy",

    description:
      "Remove 25% points from a random enemy",

    poolCount: 1,

    icon: "minus25percent",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      const targets = []

      for (const player of match.getAlivePlayers()) {
        if (
          player.id !==
          sourcePlayerId
        ) {
          targets.push(player)
        }
      }

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

      randomTarget.score =
        Math.ceil(
          randomTarget.score *
            0.75
        )
    },
  }