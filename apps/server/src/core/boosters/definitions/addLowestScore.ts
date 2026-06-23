import { BoosterDefinition } from "../BoosterTypes"

export const addLowestScore: BoosterDefinition = {
  id: "ADD_LOWEST_SCORE",

  name: "+ очки аутсайдера",

  description:
    "Добавляет к вашим очкам наименьший счет в матче",

  poolCount: 1,

  icon: "addLowestScore",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) {
      return
    }

    const alivePlayers =
      match.getAlivePlayers()

    if (alivePlayers.length === 0) {
      return
    }

    const minScore = Math.min(
      ...alivePlayers.map(
        p => p.score
      )
    )

    player.score += minScore
  },
}