import { BoosterDefinition } from "../BoosterTypes"

export const squareRoundPoints: BoosterDefinition =
  {
    id: "SQUARE_ROUND_POINTS",

    name:
      "+ очки = квадрат раунда",

    description:
      "Добавляет себе количество очков равное квадрату текущего раунда",

    poolCount: 1,

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
        (match.round ?? 0) * (match.round ?? 0)
    },
  }