import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus15PercenttoallBooster: BoosterDefinition =
  {
    id: "MINUS_15PERCENT_TO_ALL",

    name:
      "-15% Points to all",

    description:
      "All other players lose 15% points",

    poolCount: 2,

    icon: "minus15percenttoall",

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
          player.score * 0.85
        )
      }
    },
  }