import { BoosterDefinition } from "../BoosterTypes"

export const squareRoundPoints: BoosterDefinition =
  {
    id: "SQUARE_ROUND_POINTS",

    name:
      "+ очки = квадрат раунда",

    description:
      "Вы получаете количество очков равное квадрату текущего раунда",

    nameEn: "+ points = round squared",

    descriptionEn: "You get points equal to the current round squared",

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