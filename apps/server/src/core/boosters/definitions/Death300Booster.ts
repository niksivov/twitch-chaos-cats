import { BoosterDefinition } from "../BoosterTypes"

export const Death300Booster: BoosterDefinition = {
  id: "DEATH_300",

  name: "-300 и смерть противника",

  description: "Теряешь 300 очков, случайный противник выбывает",

  poolCount: 1,

  icon: "300death",

  execute: ({ match, sourcePlayerId }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) return

    player.score -= 300

    const targets =
      match
        .getAlivePlayers()
        .filter(
          (p) =>
            p.playerId !==
            sourcePlayerId
        )

    if (targets.length === 0) return

    const victim =
      targets[
        Math.floor(
          Math.random() *
            targets.length
        )
      ]

    victim.isAlive = false
  },
}
