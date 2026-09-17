import { BoosterDefinition } from "../BoosterTypes"

export const QueueScoreBooster: BoosterDefinition = {
  id: "QUEUE_SCORE",

  name: "+10 Х Ваше место в очереди",

  description:
    "Вы получаете +10 очков умноженное на Ваше место в очереди ЭТОГО РАУНДА",

  nameEn: "+10 × Your queue position",

  descriptionEn:
    "You get +10 points multiplied by your position in THIS ROUND's queue",

  poolCount: 1,

  icon: "queue",

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

    const index =
      match.turnOrder.indexOf(
        sourcePlayerId
      )

    const position =
      index === -1
        ? 1
        : index + 1

    player.score +=
      position * 10
  },
}