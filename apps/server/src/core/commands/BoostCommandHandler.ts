import { MatchManager } from "../MatchManager"

import { BoosterEngine } from "../boosters/BoosterEngine"

import { TurnEngine } from "../TurnEngine"

import { BoostCommand } from "./BoostCommand"

export class BoostCommandHandler {
  private boosterEngine =
    new BoosterEngine()

  private turnEngine =
    new TurnEngine()

  constructor(
    private matchManager: MatchManager
  ) {}

  handle(
    command: BoostCommand
  ) {
    const match =
      this.matchManager.getMatch(
        command.roomId
      )

    if (!match) {
      return
    }

    const currentTurnPlayerId =
      match.state
        .currentTurnPlayerId

    if (
      currentTurnPlayerId !==
      command.playerId
    ) {
      return
    }

    this.boosterEngine.activateBooster(
      match,

      command.playerId,

      command.slot
    )

    this.turnEngine.moveToNextPlayer(
      match
    )
  }
}