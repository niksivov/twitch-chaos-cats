import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus10Booster: BoosterDefinition =
  {
    id: "PLUS_10",

    name: "+10",

    description:
      "Add 10 points to yourself",

    poolCount: 10,

    icon: "plus10",

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

      player.score += 10
    },
  }