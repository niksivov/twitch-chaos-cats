import { Match } from "./Match"

export class RoundEngine {
  process(match: Match) {
    const alivePlayers =
      match.getAlivePlayers()

    if (alivePlayers.length <= 1) {
      return
    }

    match.round += 1

    for (const player of alivePlayers) {
      if (player.score < 0) {
        player.score = 0
      }
    }
  }
}