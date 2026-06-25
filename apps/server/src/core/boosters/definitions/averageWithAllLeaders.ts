import { BoosterDefinition } from "../BoosterTypes"

export const averageWithAllLeaders: BoosterDefinition = {
  id: "AVERAGE_WITH_ALL_LEADERS",

  name: "Усреднение с лидером",

  description:
    "Ваш счет и счет всех лидеров становятся равны их среднему значению (округление вверх)",

  poolCount: 2,

  icon: "averageWithLeader",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) return

    const alivePlayers = match.getAlivePlayers()

    if (alivePlayers.length === 0) return

    const maxScore = Math.max(
      ...alivePlayers.map(p => p.score)
    )

    const leaders = alivePlayers.filter(
      p => p.score === maxScore
    )

    if (leaders.length === 0) return

    // если ты сам один из лидеров — бустер можно либо игнорировать, либо всё равно применять
    if (leaders.some(l => l.playerId === sourcePlayerId)) {
      // оставляем поведение симметричным — применяем всё равно
    }

    const sumAll =
      player.score +
      leaders.reduce((sum, l) => sum + l.score, 0)

    const count = leaders.length + 1

    const avg =
      sumAll % count === 0
        ? sumAll / count
        : Math.floor(sumAll / count) + 1 // округление вверх

    // применяем всем лидерам
    leaders.forEach(l => {
      l.score = avg
    })

    // применяем игроку
    player.score = avg
  },
}