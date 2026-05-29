import { Match } from "./Match"

export class TurnEngine {
  startTurn(match: Match) {
    const activePlayers =
      match.getActivePlayers()

    if (
      activePlayers.length === 0
    ) {
      return
    }

    if (
      !match.currentPlayerId
    ) {
      match.setCurrentPlayer(
        activePlayers[0].id
      )

      return
    }

    const currentIndex =
      activePlayers.findIndex(
        (player) =>
          player.id ===
          match.currentPlayerId
      )

    if (currentIndex === -1) {
      match.setCurrentPlayer(
        activePlayers[0].id
      )

      return
    }

    const nextIndex =
      (currentIndex + 1) %
      activePlayers.length

    const nextPlayer =
      activePlayers[nextIndex]

    if (!nextPlayer) {
      return
    }

    match.setCurrentPlayer(
      nextPlayer.id
    )
  }
}