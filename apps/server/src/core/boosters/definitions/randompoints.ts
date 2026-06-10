import { BoosterDefinition } from "../BoosterTypes"

export const randompoints: BoosterDefinition =
  {
    id: "RANDOM_POINTS_0_TO_100",

    name:
      "0-100 очков",

    description:
      "Получить случайное количество очков от 0 до 100",

    poolCount: 1,

    icon: "randompoints",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      const player =
        match.state.registeredPlayers[
          sourcePlayerId
        ]

      if (!player) {
        return
      }

      const points =
        Math.floor(
          Math.random() * 101
        )

      player.score +=
        points
    },
  }