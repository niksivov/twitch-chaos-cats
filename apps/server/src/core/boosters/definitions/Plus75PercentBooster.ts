import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus75PercentBooster: BoosterDefinition =
  {
    id: "MULTIPLY_175",

    name:
      "+75% Points",

    description:
      "Increase your score by 75%",

    poolCount: 2,

    icon: "multiply_175",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      const player =
        match.state.playersById[
          sourcePlayerId
        ]

      if (!player) {
        return
      }

      player.score =
        Math.ceil(
          player.score * 1.75
        )
    },
  }