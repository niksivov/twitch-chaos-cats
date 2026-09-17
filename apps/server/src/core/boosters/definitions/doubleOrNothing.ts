import { BoosterDefinition } from "../BoosterTypes"

export const doubleOrNothing: BoosterDefinition = {
  id: "DOUBLE_OR_NOTHING",

  name: "+200 или смерть",

  description:
    "Вы получите +200 очков или Вы умрете - вероятность 50%/50%",

  nameEn: "+200 or death",

  descriptionEn:
    "You get +200 points or you die - 50%/50% chance",

  poolCount: 1,

  icon: "doubleOrNothing",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) {
      return
    }

    const success =
      Math.random() < 0.5

    if (success) {
      player.score += 200
    } else {
      player.isAlive = false
    }
  },
}