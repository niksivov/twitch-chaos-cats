import { Match } from "./Match"

export class LeaderEngine {
  process(match: Match) {
    const alivePlayers =
      match.getAlivePlayers()

    if (alivePlayers.length === 0) {
      return
    }

    let leader =
      alivePlayers[0]

    for (const player of alivePlayers) {
      if (
        player.score >
        leader.score
      ) {
        leader = player
      }
    }

    match.state.leaderId =
      leader.id
  }
}