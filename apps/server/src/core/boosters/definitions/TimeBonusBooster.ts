import { BoosterDefinition } from "../BoosterTypes"

export const TimeBonusBooster: BoosterDefinition = {
  id: "TIME_BONUS_BOOSTER",

  name: "+1 за каждые 10 секунд матча",

  description:
    "Добавляет себе +1 за каждые 10 секунд матча",

  poolCount: 0,

  icon: "timebonus",

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

    player.score += Math.ceil(
      (match.state.tick ?? 0) / 10
    )
  },
}