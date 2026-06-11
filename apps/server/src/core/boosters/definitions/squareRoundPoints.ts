import { BoosterDefinition } from "../BoosterTypes"

export const squareRoundPoints: BoosterDefinition =
  {
    id: "SQUARE_ROUND_POINTS",

    name:
      "+Очки = квадрат раунда",

    description:
      "Добавляет себе количество очков равное квадрату текущего раунда",

    poolCount: 3,

    icon: "squareRoundPoints",

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

      player.score +=
        (match.state.tick ?? 0) * (match.state.tick ?? 0)
    },
  }