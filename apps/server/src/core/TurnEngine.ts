import { Match } from "./Match"

export class TurnEngine {
  startTurn(match: Match) {
    const alivePlayers =
      match.getAlivePlayers()

    if (
      alivePlayers.length === 0
    ) {
      return
    }

    if (
      !match.currentPlayerId
    ) {
      match.setCurrentPlayer(
        alivePlayers[0].id
      )

      return
    }

    const currentIndex =
      alivePlayers.findIndex(
        (player) =>
          player.id ===
          match.currentPlayerId
      )

    if (currentIndex === -1) {
      match.setCurrentPlayer(
        alivePlayers[0].id
      )

      return
    }

    const nextIndex =
      (currentIndex + 1) %
      alivePlayers.length

    const nextPlayer =
      alivePlayers[nextIndex]

    if (!nextPlayer) {
      return
    }

    match.setCurrentPlayer(
      nextPlayer.id
    )
  }
}