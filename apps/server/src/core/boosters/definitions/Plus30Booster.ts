import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus30Booster: BoosterDefinition =
  {
    id: "PLUS_30",

    name: "+30",

    description:
      "Add 30 points to yourself",

    poolCount: 5,

    icon: "plus30",

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

      player.score += 30
    },
  }