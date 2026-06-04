import { BoosterDefinition } from "../BoosterTypes"

export const swapscore: BoosterDefinition =
  {
    id: "SWAP_SCORE_RANDOM_OPPONENT",

    name:
      "Обмен очками",

    description:
      "Поменяться очками со случайным противником",

    poolCount: 3,

    icon: "swapscore",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      const sourcePlayer =
        match.state.playersById[
          sourcePlayerId
        ]

      if (!sourcePlayer) {
        return
      }

      const opponents = []

      for (const player of match.getAlivePlayers()) {
        if (
          player.id !==
          sourcePlayerId
        ) {
          opponents.push(player)
        }
      }

      if (
        opponents.length === 0
      ) {
        return
      }

      const randomOpponent =
        opponents[
          Math.floor(
            Math.random() *
              opponents.length
          )
        ]

      const sourceScore =
        sourcePlayer.score

      sourcePlayer.score =
        randomOpponent.score

      randomOpponent.score =
        sourceScore
    },
  }