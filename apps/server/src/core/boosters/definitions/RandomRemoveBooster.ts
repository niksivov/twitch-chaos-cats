import {
  BoosterDefinition,
} from "../BoosterTypes"

export const RandomRemoveBooster: BoosterDefinition =
  {
    id: "RANDOM_REMOVE",

    name:
      "случайная смерть",

    description:
      "Remove random enemy from game",

    poolCount: 1,

    icon: "random_remove",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      const targets =
        match
          .getAlivePlayers()
          .filter(
            (
              player: any
            ) =>
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

      randomTarget.isAlive =
        false
    },
  }