import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus25PercentBooster: BoosterDefinition =
  {
    id: "MULTIPLY_125",

    name:
      "+25%",

    description:
      "Increase your score by 25%",

    poolCount: 3,

    icon: "multiply_125",

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
          player.score * 1.25
        )
    },
  }