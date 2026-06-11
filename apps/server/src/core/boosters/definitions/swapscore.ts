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
        match.state.registeredPlayers[
          sourcePlayerId
        ]

      if (!sourcePlayer) {
        return
      }

      const opponents =
        match
          .getAlivePlayers()
          .filter(
            (player: any) =>
              player.playerId !==
              sourcePlayerId
          )

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