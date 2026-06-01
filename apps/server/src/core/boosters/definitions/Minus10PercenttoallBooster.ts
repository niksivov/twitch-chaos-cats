import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus10PercenttoallBooster: BoosterDefinition =
  {
    id: "MINUS_10PERCENT_TO_ALL",

    name:
      "-10% Points to all",

    description:
      "All other players lose 10% points",

    poolCount: 2,

    icon: "minus10percenttoall",

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

      player.score =
        Math.ceil(
          player.score * 0.9
        )
      }
    },
  }