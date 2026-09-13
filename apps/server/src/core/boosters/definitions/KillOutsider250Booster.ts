import { BoosterDefinition } from "../BoosterTypes"

export const KillOutsider250Booster: BoosterDefinition = {
  id: "KILL_OUTSIDER_250",

  name: "-250 (если есть) за смерть аутсайдера",

  description:
    "Если у Вас 250 или больше очков — все игроки с наименьшим счётом умирают, и Вы теряете 250",

  poolCount: 1,

  icon: "mark",

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

    if (player.score < 250) {
      return
    }

    const alivePlayers =
      match.getAlivePlayers()

    if (alivePlayers.length === 0) {
      return
    }

    const lowestScore = Math.min(
      ...alivePlayers.map(p => p.score)
    )

    alivePlayers
      .filter(p => p.score === lowestScore)
      .forEach(p => {
        p.isAlive = false
      })

    player.score -= 250
  },
}