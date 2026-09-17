import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus5Booster: BoosterDefinition =
  {
    id: "PLUS_5",

    name: "+5",

    description:
      "Вы получаете 5 очков",

    nameEn: "+5",

    descriptionEn: "You get 5 points",

    poolCount: 0,

    icon: "plus5",

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

      player.score += 5
    },
  }