import { BoosterDefinition } from "../BoosterTypes"
import type { Match } from "../../Match"

export const PANDORA_EFFECTS = [
  { id: 0, label: "300 соперникам", color: "#c62828" },
  { id: 1, label: "Ты умираешь, остальные +100", color: "#b71c1c" },
  { id: 2, label: "Твои очки раздаются", color: "#e65100" },
  { id: 3, label: "Случайный -5000", color: "#880e4f" },
  { id: 4, label: "+1 очко", color: "#2e7d32" },
  { id: 5, label: "Половина умирает", color: "#b71c1c" },
  { id: 6, label: "Перемешать очки", color: "#e65100" },
  { id: 7, label: "Кража 50 у каждого", color: "#1565c0" },
  { id: 8, label: "×3 очков", color: "#2e7d32" },
  { id: 9, label: "50% цели", color: "#1b5e20" },
]

export function applyPandoraEffect(match: Match, roll: number) {
  const sourcePlayerId = match.currentPlayerId
  if (!sourcePlayerId) return

  const player = match.state.registeredPlayers[sourcePlayerId]
  if (!player) return

  const players = match.getAlivePlayers()
  const others = players.filter(p => p.playerId !== sourcePlayerId)

  const distribute = (amount: number, targets: any[]) => {
    if (targets.length === 0 || amount <= 0) return
    const weights = targets.map(() => Math.random())
    const sum = weights.reduce((a, b) => a + b, 0)
    let used = 0
    const values = weights.map(w => {
      const v = Math.floor((w / sum) * amount)
      used += v
      return v
    })
    let remainder = amount - used
    while (remainder > 0) {
      const i = Math.floor(Math.random() * targets.length)
      values[i]++
      remainder--
    }
    targets.forEach((t, i) => { t.score += values[i] })
  }

  switch (roll) {
    case 0:
      distribute(300, others)
      break
    case 1:
      player.isAlive = false
      others.forEach(p => (p.score += 100))
      break
    case 2: {
      const total = player.score
      player.score = 0
      distribute(total, others)
      break
    }
    case 3: {
      const target = players[Math.floor(Math.random() * players.length)]
      target.score -= 5000
      break
    }
    case 4:
      player.score += 1
      break
    case 5: {
      const shuffled = [...players].sort(() => Math.random() - 0.5)
      const half = Math.floor(shuffled.length / 2)
      for (let i = 0; i < half; i++) {
        shuffled[i].isAlive = false
      }
      break
    }
    case 6: {
      const scores = players.map(p => p.score)
      for (let i = scores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[scores[i], scores[j]] = [scores[j], scores[i]]
      }
      players.forEach((p, i) => { p.score = scores[i] })
      break
    }
    case 7:
      others.forEach(p => {
        const steal = Math.min(50, p.score)
        p.score -= steal
        player.score += steal
      })
      break
    case 8:
      player.score *= 3
      break
    case 9:
      player.score += Math.ceil(match.state.targetPoints * 0.5)
      break
  }
}

export const pandoraBox: BoosterDefinition = {
  id: "PANDORA_BOX",
  name: "ХАОС",
  description: "Выпадает случайный эффект из 10 катастрофических событий",
  poolCount: 1,
  icon: "pandoraBox",

  execute: ({ match, sourcePlayerId }) => {
    const player = match.state.registeredPlayers[sourcePlayerId]
    if (!player) return

    const roll = Math.floor(Math.random() * 10)

    match.state.pendingPandoraRoll = roll
    match.state.pandoraResult = {
      effects: PANDORA_EFFECTS,
      selectedIndex: roll,
    }
  },
}
