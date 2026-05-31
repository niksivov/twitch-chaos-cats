import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus50Booster: BoosterDefinition =
  {
    id: "PLUS_50",

    name: "+50 Points",

    description:
      "Add 50 points to yourself",

    poolCount: 5,

    icon: "plus50",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      const player =
        match.state.playersById[
          sourcePlayerId
        ]

      if (!player) {
        return
      }

      player.score += 50
    },
  }