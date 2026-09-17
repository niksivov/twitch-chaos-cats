import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus25PercentBooster: BoosterDefinition =
  {
    id: "MULTIPLY_125",

    name:
      "+25%",

    description:
      "Вы получаете +25% к счету",

    nameEn: "+25%",

    descriptionEn: "You get +25% of your score",

    poolCount: 3,

    icon: "multiply_125",

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
          player.score * 1.25
        )
    },
  }