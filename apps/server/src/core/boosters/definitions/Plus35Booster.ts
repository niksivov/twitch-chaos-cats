import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus35Booster: BoosterDefinition =
  {
    id: "PLUS_35",

    name: "+35",

    description:
      "Вы получаете 35 очков",

    nameEn: "+35",

    descriptionEn: "You get 35 points",

    poolCount: 0,

    icon: "plus35",

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

      player.score += 35
    },
  }