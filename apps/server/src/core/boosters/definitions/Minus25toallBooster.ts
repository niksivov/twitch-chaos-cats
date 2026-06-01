import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus25toallBooster: BoosterDefinition =
  {
    id: "MINUS_25_TO_ALL",

    name:
      "-25 Points to all",

    description:
      "All other players lose 25 points",

    poolCount: 2,

    icon: "minus25toall",

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

        player.score -= 25
      }
    },
  }