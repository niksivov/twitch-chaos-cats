import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus5PercenttoallBooster: BoosterDefinition =
  {
    id: "MINUS_5PERCENT_TO_ALL",

    name:
      "-5% всем противникам",

    description:
      "Все противники теряют 5% от счета",

    poolCount: 0,

    icon: "minus5percenttoall",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      for (const player of match.getAlivePlayers()) {
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