import { BoosterDefinition } from "../BoosterTypes"

export const comebackLeader: BoosterDefinition = {
  id: "COMEBACK_LEADER",

  name: "Если у тебя <0, стань лидером!",

  description:
    "Если у тебя меньше 0 очков, твой счет становится равен максимальному счету в матче + 1",

  poolCount: 1,

  icon: "comebackLeader",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) {
      return
    }

    if (player.score >= 0) {
      return
    }

    const alivePlayers = match.getAlivePlayers()

    if (alivePlayers.length === 0) {
      return
    }

    const maxScore = Math.max(
      ...alivePlayers.map(p => p.score)
    )

    player.score = maxScore + 1
  },
}