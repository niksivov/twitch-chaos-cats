import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus5toallBooster: BoosterDefinition =
  {
    id: "MINUS_5_TO_ALL",

    name:
      "-5 Points to all",

    description:
      "All other players lose 5 points",

    poolCount: 2,

    icon: "minus5toall",

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

        player.score -= 5
      }
    },
  }