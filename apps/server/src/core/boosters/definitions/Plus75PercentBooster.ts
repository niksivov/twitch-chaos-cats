import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus75PercentBooster: BoosterDefinition =
  {
    id: "MULTIPLY_175",

    name:
      "+75%",

    description:
      "Вы получаете +75% к счету",

    poolCount: 1,

    icon: "multiply_175",

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
          player.score * 1.75
        )
    },
  }