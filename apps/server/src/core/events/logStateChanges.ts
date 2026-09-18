import type { Match } from "../Match"
import type { EventLog } from "./EventLog"

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

export function logStateChanges(
  eventLog: EventLog,
  match: Match,
  before: Map<string, PlayerSnapshot>
) {
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

  // Новые события кладутся сверху (unshift), поэтому очки добавляем
  // первыми, а смерти — последними, чтобы порядок чтения был:
  // активация → смерти → очки.
  if (pointChanges.length > 0) {
    eventLog.add(
      match,
      `📊 Очки: ${pointChanges.join(", ")}`,
      `📊 Points: ${pointChanges.join(", ")}`
    )
  }

  for (const username of deaths) {
    eventLog.add(
      match,
      `💀 ${username} выбывает`,
      `💀 ${username} is eliminated`
    )
  }
}
