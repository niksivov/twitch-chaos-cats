import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus15toallBooster: BoosterDefinition =
  {
    id: "MINUS_15_TO_ALL",

    name:
      "-15 всем противникам",

    description:
      "Все противники теряют 15 очков",

    nameEn: "-15 to all opponents",

    descriptionEn: "All opponents lose 15 points",

    poolCount: 1,

    icon: "minus15toall",

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

        player.score -= 15
      }
    },
  }