import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus10Booster: BoosterDefinition =
  {
    id: "PLUS_10",

    name: "+10",

    description:
      "Вы получаете 10 очков",

    poolCount: 5,

    icon: "plus10",

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

      player.score += 10
    },
  }