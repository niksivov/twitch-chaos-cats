import { MatchManager } from "../MatchManager"
import { Room } from "../Room"

interface BoosterPoolBroadcaster {
  broadcastBoosterPoolStatus(channel: string, message: string): void
  broadcastBoosterList(channel: string): void
}

export function applyBoosterPoolConfig(
  room: Room,
  matchManager: MatchManager,
  broadcaster: BoosterPoolBroadcaster,
  config: Record<string, number>,
  statusMessage: string
) {
  room.boosterPoolConfig = { ...config }
  if (room.matchId) {
    const match = matchManager.getMatch(room.matchId)
    if (match) {
      match.state.boosterPoolConfig = { ...room.boosterPoolConfig }
      match.state.boosterPool = []
      match.state.roundDealtIds = []
    }
  }
  broadcaster.broadcastBoosterPoolStatus(room.channel, statusMessage)
  broadcaster.broadcastBoosterList(room.channel)
}