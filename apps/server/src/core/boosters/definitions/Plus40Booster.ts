import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus40Booster: BoosterDefinition =
  {
    id: "PLUS_40",

    name: "+40",

    description:
      "Вы получаете 40 очков",

    nameEn: "+40",

    descriptionEn: "You get 40 points",

    poolCount: 3,

    icon: "plus40",

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

      player.score += 40
    },
  }