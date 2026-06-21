import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Plus25Booster: BoosterDefinition =
  {
    id: "PLUS_25",

    name: "+25",

    description:
      "Add 25 points to yourself",

    poolCount: 0,

    icon: "plus25",

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

      player.score += 25
    },
  }