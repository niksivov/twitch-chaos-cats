import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus100PercentBooster: BoosterDefinition =
  {
    id: "MULTIPLY_200",

    name:
      "+100%",

    description:
      "Increase your score by 100%",

    poolCount: 1,

    icon: "multiply_200",

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
          player.score * 2
        )
    },
  }