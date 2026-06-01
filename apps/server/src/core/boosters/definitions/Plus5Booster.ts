import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus5Booster: BoosterDefinition =
  {
    id: "PLUS_5",

    name: "+5",

    description:
      "Add 5 points to yourself",

    poolCount: 10,

    icon: "plus5",

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

      player.score += 5
    },
  }