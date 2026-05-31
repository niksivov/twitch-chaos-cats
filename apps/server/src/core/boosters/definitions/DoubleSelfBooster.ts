import {
  BoosterDefinition,
} from "../BoosterTypes"

export const DoubleSelfBooster: BoosterDefinition =
  {
    id: "DOUBLE_SELF",

    name:
      "Double Points",

    description:
      "Double your current score",

    poolCount: 2,

    icon: "double_self",

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

      player.score =
        player.score * 2
    },
  }