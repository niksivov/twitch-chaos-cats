import { BoosterDefinition } from "../BoosterTypes"

export const generousChaos: BoosterDefinition = {
  id: "GENEROUS_CHAOS",

  name: "+75 тебе, +100 между другими",

  description:
    "Вы получаете 75 очков, а между противниками случайно распределяется 100",

  poolCount: 1,

  icon: "generousChaos",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    const sourcePlayer =
      match.state.registeredPlayers[sourcePlayerId]

    if (!sourcePlayer) {
      return
    }

    sourcePlayer.score += 75

    const opponents =
      match
        .getAlivePlayers()
        .filter(
          p =>
            p.playerId !== sourcePlayerId
        )

    if (opponents.length === 0) {
      return
    }

    const total = 100

    const weights = opponents.map(
      () => Math.random()
    )

    const weightSum = weights.reduce(
      (sum, w) => sum + w,
      0
    )

    const rewards: number[] = []
    let distributed = 0

    for (const weight of weights) {
      const amount = Math.floor(
        (weight / weightSum) * total
      )

      rewards.push(amount)
      distributed += amount
    }

    let remainder =
      total - distributed

    while (remainder > 0) {
      const index = Math.floor(
        Math.random() *
          opponents.length
      )

      rewards[index]++
      remainder--
    }

    opponents.forEach(
      (player, index) => {
        player.score +=
          rewards[index]
      }
    )
  },
}