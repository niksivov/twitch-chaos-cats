import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus45Booster: BoosterDefinition =
  {
    id: "PLUS_45",

    name: "+45",

    description:
      "Вы получаете 45 очков",

    poolCount: 0,

    icon: "plus45",

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

      player.score += 45
    },
  }