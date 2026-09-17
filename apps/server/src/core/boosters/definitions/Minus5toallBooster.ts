import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus5toallBooster: BoosterDefinition =
  {
    id: "MINUS_5_TO_ALL",

    name:
      "-5 всем противникам",

    description:
      "Все противники теряют 5 очков",

    nameEn: "-5 to all opponents",

    descriptionEn: "All opponents lose 5 points",

    poolCount: 0,

    icon: "minus5toall",

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

        player.score -= 5
      }
    },
  }