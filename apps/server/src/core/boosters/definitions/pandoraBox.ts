import { BoosterDefinition } from "../BoosterTypes"

export const pandoraBox: BoosterDefinition = {
  id: "PANDORA_BOX",

  name: "ХАОС",

  description: "Выпадает случайный эффект из 10 катастрофических событий",

  poolCount: 1,

  icon: "pandoraBox",

  execute: ({ match, sourcePlayerId }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) return

    const roll = Math.floor(Math.random() * 10)

    const players = match.getAlivePlayers()
    const others = players.filter(
      p => p.playerId !== sourcePlayerId
    )

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

      targets.forEach((t, i) => {
        t.score += values[i]
      })
    }

    switch (roll) {
      // 0 — 300 соперникам
      case 0:
        distribute(300, others)
        break

      // 1 — ты умираешь, остальные +100
      case 1:
        player.isAlive = false
        others.forEach(p => (p.score += 100))
        break

      // 2 — твои очки распределяются
      case 2: {
        const total = player.score
        player.score = 0
        distribute(total, others)
        break
      }

      // 3 — случайный игрок -5000
      case 3: {
        const target = players[Math.floor(Math.random() * players.length)]
        target.score -= 5000
        break
      }

      // 4 — +1
      case 4:
        player.score += 1
        break

      // 5 — половина игроков умирает
      case 5: {
        const shuffled = [...players].sort(() => Math.random() - 0.5)
        const half = Math.floor(shuffled.length / 2)

        for (let i = 0; i < half; i++) {
          shuffled[i].isAlive = false
        }
        break
      }

      // 6 — перемешивание очков
      case 6: {
        const scores = players.map(p => p.score)

        for (let i = scores.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[scores[i], scores[j]] = [scores[j], scores[i]]
        }

        players.forEach((p, i) => {
          p.score = scores[i]
        })
        break
      }

      // 7 — ты крадешь 50 у каждого
      case 7:
        others.forEach(p => {
          const steal = Math.min(50, p.score)
          p.score -= steal
          player.score += steal
        })
        break

      // 8 — ×3
      case 8:
        player.score *= 3
        break

      // 9 — 50% цели
      case 9:
        player.score += Math.ceil(match.state.targetPoints * 0.5)
        break
    }
  },
}