import { BoosterDefinition } from "../BoosterTypes"

export const BetBooster: BoosterDefinition = {
  id: "BET",

  name: "СТАВКА",

  description:
    "Напишите число от 1 до 99 в чат. Вы умираете с вероятностью X%, но если выживаете, то получаете +X% от цели",

  poolCount: 1,

  icon: "bet",

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

    const x =
      match.state.lastBetNumber[
        sourcePlayerId
      ] ?? 0

    if (x <= 0) {
      return
    }

    if (Math.random() * 100 < x) {
      player.isAlive = false
      delete match.state.lastBetNumber[sourcePlayerId]
      return
    }

    const target =
      match.state.targetPoints ?? 100

    player.score +=
      Math.ceil((target * x) / 100)

    delete match.state.lastBetNumber[sourcePlayerId]
  },
}