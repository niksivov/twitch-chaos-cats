import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus35Booster: BoosterDefinition =
  {
    id: "PLUS_35",

    name: "+35",

    description:
      "Вы получаете 35 очков",

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