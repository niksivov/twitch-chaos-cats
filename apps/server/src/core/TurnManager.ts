import { Player } from "../models/Player"

export class TurnManager {
  private turnOrder: Player[] = []

  private currentTurnIndex = 0

  private currentTurnStartedAt =
    0

  setup(
    players: Player[],
    round: number
  ) {
    const alivePlayers =
      players.filter((player) => {
        return !player.eliminated
      })

    if (round === 1) {
      this.turnOrder = [
        ...alivePlayers,
      ]
    } else {
      this.turnOrder = [
        ...alivePlayers,
      ].sort((a, b) => {
        return (
          a.points - b.points
        )
      })
    }

    this.currentTurnIndex = 0

    this.currentTurnStartedAt =
      Date.now()
  }

  getCurrentPlayer() {
    return this.turnOrder[
      this.currentTurnIndex
    ]
  }

  nextTurn() {
    this.currentTurnIndex++

    this.currentTurnStartedAt =
      Date.now()
  }

  isRoundFinished() {
    return (
      this.currentTurnIndex >=
      this.turnOrder.length
    )
  }

  getTurnOrder() {
    return this.turnOrder
  }

  getCurrentTurnStartedAt() {
    return this
      .currentTurnStartedAt
  }

  isCurrentPlayer(
    playerId: string
  ) {
    const currentPlayer =
      this.getCurrentPlayer()

    if (!currentPlayer) {
      return false
    }

    return (
      currentPlayer.id ===
      playerId
    )
  }
}