import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus25Booster: BoosterDefinition =
  {
    id: "PLUS_25",

    name: "+25 Points",

    description:
      "Add 25 points to yourself",

    poolCount: 10,

    icon: "plus25",

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

      player.score += 25
    },
  }