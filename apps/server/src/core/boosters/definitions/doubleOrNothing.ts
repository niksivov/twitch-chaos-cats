import { BoosterDefinition } from "../BoosterTypes"

export const doubleOrNothing: BoosterDefinition = {
  id: "DOUBLE_OR_NOTHING",

  name: "+200 или смерть",

  description:
    "Вы получите +200 очков или Вы умрете - вероятность 50%/50%",

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