import { BoosterDefinition } from "../BoosterTypes"
import type { Match } from "../../Match"

export interface WheelPlayer {
  id: string
  username: string
  avatarId: string
  score: number
  probability: number
}

export interface WheelResult {
  players: WheelPlayer[]
  winnerId: string
}

export const WheelBooster: BoosterDefinition = {
  id: "WHEEL",

  name: "Если у Вас >80% от цели — крутите КОЛЕСО!",

  description:
    "Если у Вас больше 80% от цели (от очков, достаточных для победы), то Вы раскручиваете колесо! Победитель выигрывает эту игру. Вероятность победить равна весу очков игрока от общей суммы очков (отрицательные очки не учитываются)",

  poolCount: 1,

  icon: "wheel",

  execute: ({ match, sourcePlayerId }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) return

    const target = match.state.targetPoints ?? 100

    if (player.score <= target * 0.8) return

    const alivePlayers = match.getAlivePlayers()

    const totalWeight = alivePlayers.reduce(
      (sum, p) => sum + Math.max(0, p.score),
      0
    )

    if (totalWeight === 0) return

    const wheelPlayers: WheelPlayer[] = alivePlayers.map(
      (p) => ({
        id: p.playerId,
        username: p.username,
        avatarId: p.avatarId,
        score: p.score,
        probability:
          Math.max(0, p.score) / totalWeight,
      })
    )

    let roll = Math.random() * totalWeight
    let winnerId = alivePlayers[0].playerId

    for (const p of alivePlayers) {
      roll -= Math.max(0, p.score)
      if (roll <= 0) {
        winnerId = p.playerId
        break
      }
    }

    match.state.wheelResult = {
      players: wheelPlayers,
      winnerId,
    }

    for (const p of alivePlayers) {
      if (p.playerId !== winnerId) {
        p.isAlive = false
      }
    }
  },
}
