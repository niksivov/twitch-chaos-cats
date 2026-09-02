import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus20Booster: BoosterDefinition =
  {
    id: "PLUS_20",

    name: "+20",

    description:
      "Вы получаете 20 очков",

    poolCount: 4,

    icon: "plus20",

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

      player.score += 20
    },
  }