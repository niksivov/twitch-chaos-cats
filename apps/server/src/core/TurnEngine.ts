import { Match } from "./Match"

export class TurnEngine {
  process(match: Match) {
    const alivePlayers =
      match.getAlivePlayers()

    if (alivePlayers.length === 0) {
      return
    }

    const currentIndex =
      alivePlayers.findIndex(
        (player) =>
          player.id ===
          match.currentPlayerId
      )

    const nextPlayer =
      currentIndex === -1
        ? alivePlayers[0]
        : alivePlayers[
            (currentIndex + 1) %
              alivePlayers.length
          ]

    if (!nextPlayer) {
      return
    }

    match.setCurrentPlayer(
      nextPlayer.id
    )
  }
}