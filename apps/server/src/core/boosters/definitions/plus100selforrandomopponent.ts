import { BoosterDefinition } from "../BoosterTypes"

export const plus100selforrandomopponent: BoosterDefinition =
  {
    id: "PLUS_100_SELF_OR_RANDOM_OPPONENT",

    name:
      "+100 тебе или противнику",

    description:
      "+100 тебе или противнику",

    poolCount: 1,

    icon: "plus100selforrandomopponent",

    execute: ({
      match,
      sourcePlayerId,
    }) => {
      const giveToSelf =
        Math.random() < 0.5

      if (giveToSelf) {
        const player =
          match.state.registeredPlayers[
            sourcePlayerId
          ]

        if (!player) {
          return
        }

        player.score += 100

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

      randomOpponent.score += 100
    },
  }