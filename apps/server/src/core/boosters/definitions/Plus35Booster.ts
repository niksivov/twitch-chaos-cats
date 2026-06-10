import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus35Booster: BoosterDefinition =
  {
    id: "PLUS_35",

    name: "+35",

    description:
      "Add 35 points to yourself",

    poolCount: 10,

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