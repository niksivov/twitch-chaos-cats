import { Match } from "./Match"

export class RoundEngine {
  process(match: Match) {
    const alivePlayers =
      match.getAlivePlayers()

    if (alivePlayers.length <= 1) {
      return
    }

    const groupedPlayers =
      [...match.players]

    groupedPlayers.sort(
      (a, b) => {
        if (
          a.score ===
          b.score
        ) {
          return (
            Math.random() - 0.5
          )
        }

        return (
          a.score -
          b.score
        )
      }
    )

    match.players.length = 0

    match.players.push(
      ...groupedPlayers
    )
  }
}