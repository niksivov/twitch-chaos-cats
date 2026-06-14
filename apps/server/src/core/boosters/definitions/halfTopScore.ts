import { BoosterDefinition } from "../BoosterTypes"

export const halfTopScore: BoosterDefinition = {
  id: "HALF_TOP_SCORE",

  name: "Половина лидера",

  description:
    "Ваш счет становится равен 50% от наибольшего счета в матче",

  poolCount: 20,

  icon: "halfTopScore",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) {
      return
    }

    const alivePlayers = match.getAlivePlayers()

    if (alivePlayers.length === 0) {
      return
    }

    const maxScore = Math.max(
      ...alivePlayers.map(p => p.score)
    )

    player.score = Math.ceil(maxScore * 0.5)
  },
}