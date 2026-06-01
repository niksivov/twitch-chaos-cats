import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus20toallBooster: BoosterDefinition =
  {
    id: "MINUS_20_TO_ALL",

    name:
      "-20 Points to all",

    description:
      "All other players lose 20 points",

    poolCount: 2,

    icon: "minus20toall",

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

        player.score -= 20
      }
    },
  }