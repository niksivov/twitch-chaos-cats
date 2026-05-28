import { Player } from '../models/Player'

export class TurnManager {
  private turnOrder: Player[] = []

  private currentTurnIndex = 0

  setup(players: Player[], round: number) {
    if (round === 1) {
      this.turnOrder = [...players]
    } else {
      this.turnOrder = [...players].sort(
        (a, b) => a.points - b.points
      )
    }

    this.currentTurnIndex = 0
  }

  getCurrentPlayer() {
    return this.turnOrder[this.currentTurnIndex]
  }

  nextTurn() {
    this.currentTurnIndex++
  }

  isRoundFinished() {
    return this.currentTurnIndex >= this.turnOrder.length
  }

  getTurnOrder() {
    return this.turnOrder
  }
}