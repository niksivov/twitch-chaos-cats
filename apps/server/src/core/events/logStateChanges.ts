import type { Match } from "../Match"

interface PlayerSnapshot {
  username: string
  score: number
  isAlive: boolean
}

export function snapshotPlayers(match: Match): Map<string, PlayerSnapshot> {
  const snapshot = new Map<string, PlayerSnapshot>()

  for (const [id, player] of Object.entries(match.state.registeredPlayers)) {
    snapshot.set(id, {
      username: player.username,
      score: player.score,
      isAlive: player.isAlive,
    })
  }

  return snapshot
}

interface StateChangeDescription {
  ru: string[]
  en: string[]
}

export function describeStateChanges(
  match: Match,
  before: Map<string, PlayerSnapshot>
): StateChangeDescription {
  const deaths: string[] = []
  const pointChanges: string[] = []

  for (const [id, player] of Object.entries(match.state.registeredPlayers)) {
    const previous = before.get(id)
    if (!previous) continue

    if (previous.isAlive && !player.isAlive) {
      deaths.push(player.username)
    }

    const delta = player.score - previous.score
    if (delta !== 0) {
      pointChanges.push(
        `${player.username} ${delta > 0 ? "+" : "-"}${Math.abs(delta)}`
      )
    }
  }

  const ru: string[] = []
  const en: string[] = []

  if (deaths.length > 0) {
    if (deaths.length === 1) {
      ru.push(`💀 ${deaths[0]} выбывает`)
      en.push(`💀 ${deaths[0]} is eliminated`)
    } else {
      ru.push(`💀 Выбывают: ${deaths.join(", ")}`)
      en.push(`💀 Eliminated: ${deaths.join(", ")}`)
    }
  }

  if (pointChanges.length > 0) {
    ru.push(`📊 Очки: ${pointChanges.join(", ")}`)
    en.push(`📊 Points: ${pointChanges.join(", ")}`)
  }

  return { ru, en }
}