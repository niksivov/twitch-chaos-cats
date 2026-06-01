import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus50PercentRandomBooster: BoosterDefinition =
  {
    id: "MINUS_50_PERCENT_RANDOM",

    name:
      "-50% Random Enemy",

    description:
      "Remove 50% points from a random enemy",

    poolCount: 1,

    icon: "minus50percent",

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
            0.5
        )
    },
  }