import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus15toallBooster: BoosterDefinition =
  {
    id: "MINUS_15_TO_ALL",

    name:
      "-15 Points to all",

    description:
      "All other players lose 15 points",

    poolCount: 2,

    icon: "minus15toall",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      for (const player of match.players) {
        if (
          player.id ===
          sourcePlayerId
        ) {
          continue
        }

        player.score -= 15
      }
    },
  }