import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus100PercentBooster: BoosterDefinition =
  {
    id: "MULTIPLY_200",

    name:
      "+100%",

    description:
      "Вы получаете +100% к счету",

    nameEn: "+100%",

    descriptionEn: "You get +100% of your score",

    poolCount: 1,

    icon: "multiply_200",

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
          player.score * 2
        )
    },
  }