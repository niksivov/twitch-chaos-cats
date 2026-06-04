import { BoosterDefinition } from "../BoosterTypes"

export const plus100or0self: BoosterDefinition = {
  id: "PLUS_100_OR_0_SELF",

  name: "+100 или 0 себе",

  description: "+100 очков себе или ничего",

  poolCount: 1,

  icon: "plus100or0self",

  execute: ({ match, sourcePlayerId }) => {
    const player = match.state.playersById[sourcePlayerId]
    if (!player) return

    // 50% шанс получить 100 очков
    if (Math.random() < 0.5) {
      player.score += 100
    }
  },
}