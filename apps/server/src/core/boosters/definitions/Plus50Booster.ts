import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus50Booster: BoosterDefinition =
  {
    id: "PLUS_50",

    name: "+50",

    description:
      "Add 50 points to yourself",

    poolCount: 2,

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