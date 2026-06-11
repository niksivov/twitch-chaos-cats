import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus25toallBooster: BoosterDefinition =
  {
    id: "MINUS_25_TO_ALL",

    name:
      "-25 всем противникам",

    description:
      "All other players lose 25 points",

    poolCount: 0,

    icon: "minus25toall",

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

        player.score -= 25
      }
    },
  }