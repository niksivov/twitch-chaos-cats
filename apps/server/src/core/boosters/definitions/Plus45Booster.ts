import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus45Booster: BoosterDefinition =
  {
    id: "PLUS_45",

    name: "+45",

    description:
      "Add 45 points to yourself",

    poolCount: 10,

    icon: "plus45",

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

      player.score += 45
    },
  }