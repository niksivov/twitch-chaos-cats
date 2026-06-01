import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus15Booster: BoosterDefinition =
  {
    id: "PLUS_15",

    name: "+15",

    description:
      "Add 15 points to yourself",

    poolCount: 10,

    icon: "plus15",

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

      player.score += 15
    },
  }