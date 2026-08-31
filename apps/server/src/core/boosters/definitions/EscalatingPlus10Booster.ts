import { BoosterDefinition } from "../BoosterTypes"

const BOOSTER_ID = "ESCALATING_PLUS10"

export const EscalatingPlus10Booster: BoosterDefinition = {
  id: BOOSTER_ID,

  name: "+10, удвоение после каждого использования",

  description:
    "+10 очков, но каждое следующее использование удваивает бонус",

  poolCount: 1,

  icon: "snowball",

  execute: ({ match, sourcePlayerId }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) return

    const count =
      match.state.boosterUsageCounts[BOOSTER_ID] ?? 0

    const bonus = 10 * Math.pow(2, count)

    player.score += bonus

    match.state.boosterUsageCounts[BOOSTER_ID] =
      count + 1
  },
}
