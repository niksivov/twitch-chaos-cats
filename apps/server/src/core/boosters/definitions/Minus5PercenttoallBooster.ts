import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus5PercenttoallBooster: BoosterDefinition =
  {
    id: "MINUS_5PERCENT_TO_ALL",

    name:
      "-5% всем противникам",

    description:
      "All other players lose 5% points",

    poolCount: 1,

    icon: "minus5percenttoall",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      for (const player of match.players) {
        if (
          player.playerId ===
          sourcePlayerId
        ) {
          continue
        }

      player.score =
        Math.ceil(
          player.score * 0.95
        )
      }
    },
  }