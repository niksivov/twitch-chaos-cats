import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus10toallBooster: BoosterDefinition =
  {
    id: "MINUS_10_TO_ALL",

    name:
      "-10 всем противникам",

    description:
      "Все противники теряют 10 очков",

    poolCount: 1,

    icon: "minus10toall",

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

        player.score -= 10
      }
    },
  }