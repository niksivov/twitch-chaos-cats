import {
  BoosterDefinition,
} from "../BoosterTypes"

export const Minus25PercentRandomBooster: BoosterDefinition =
  {
    id: "MINUS_25_PERCENT_RANDOM",

    name:
      "-25% случайному противнику",

    description:
      "Случайный противник теряет 25% очков",

    nameEn: "-25% to a random opponent",

    descriptionEn: "A random opponent loses 25% of their score",

    poolCount: 1,

    icon: "minus25percentrandom",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      const targets =
        match
          .getAlivePlayers()
          .filter(
            (player: any) =>
              player.playerId !==
              sourcePlayerId
          )

      if (
        targets.length === 0
      ) {
        return
      }

      const randomTarget =
        targets[
          Math.floor(
            Math.random() *
              targets.length
          )
        ]

      randomTarget.score =
        Math.ceil(
          randomTarget.score *
            0.75
        )
    },
  }