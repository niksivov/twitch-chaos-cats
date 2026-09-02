import { BoosterDefinition } from "../BoosterTypes"

export const tripleRandomScore: BoosterDefinition =
  {
    id: "TRIPLE_RANDOM_PLAYER_SCORE",

    name:
      "×3 случайному игроку",

    description:
      "Счет случайного игрока умножается на 3",

    poolCount: 1,

    icon: "tripleRandomScore",

    execute: ({
      match,
    }) => {
      const alivePlayers = match.getAlivePlayers()

      if (alivePlayers.length === 0) {
        return
      }

      const randomPlayer =
        alivePlayers[
          Math.floor(Math.random() * alivePlayers.length)
        ]

      randomPlayer.score =
        randomPlayer.score * 3
    },
  }