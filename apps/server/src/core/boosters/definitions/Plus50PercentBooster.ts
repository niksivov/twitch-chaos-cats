import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus50PercentBooster: BoosterDefinition =
  {
    id: "MULTIPLY_150",

    name:
      "+50%",

    description:
      "Increase your score by 50%",

    poolCount: 2,

    icon: "multiply_150",

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
          player.score * 1.5
        )
    },
  }