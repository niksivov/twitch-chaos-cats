import { BoosterDefinition } from "../BoosterTypes"

export const doubleOrNothing: BoosterDefinition = {
  id: "DOUBLE_OR_NOTHING",

  name: "+200 или смерть",

  description:
    "50%: +200 очков. 50%: смерть",

  poolCount: 20,

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