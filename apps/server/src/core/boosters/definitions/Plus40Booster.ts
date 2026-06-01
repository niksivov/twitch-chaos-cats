import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus40Booster: BoosterDefinition =
  {
    id: "PLUS_40",

    name: "+40",

    description:
      "Add 40 points to yourself",

    poolCount: 3,

    icon: "plus40",

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

      player.score += 40
    },
  }