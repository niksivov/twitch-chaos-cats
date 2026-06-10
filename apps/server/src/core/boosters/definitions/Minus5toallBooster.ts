import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus5toallBooster: BoosterDefinition =
  {
    id: "MINUS_5_TO_ALL",

    name:
      "-5 всем противникам",

    description:
      "All other players lose 5 points",

    poolCount: 1,

    icon: "minus5toall",

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

        player.score -= 5
      }
    },
  }