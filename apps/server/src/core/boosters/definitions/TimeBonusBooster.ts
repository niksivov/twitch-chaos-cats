import { BoosterDefinition } from "../BoosterTypes"

export const TimeBonusBooster: BoosterDefinition = {
  id: "TIME_BONUS_BOOSTER",

  name: "+1 за каждые 10 секунд матча",

  description:
    "Вы получаете +1 очко за каждые 10 секунд, что идет эта игра",

  nameEn: "+1 for every 10 seconds of the match",

  descriptionEn:
    "You get +1 point for every 10 seconds this game has been running",

  poolCount: 2,

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