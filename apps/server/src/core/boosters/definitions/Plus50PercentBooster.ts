import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus50PercentBooster: BoosterDefinition =
  {
    id: "MULTIPLY_150",

    name:
      "+50%",

    description:
      "Вы получаете +50% к счету",

    poolCount: 2,

    icon: "multiply_150",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      const player =
        match.state.registeredPlayers[
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