import { Match } from "./Match"

import { TurnEngine } from "./TurnEngine"

import { EventLog } from "./events/EventLog"

export class TurnTimerEngine {
  private turnEngine =
    new TurnEngine()

  private eventLog =
    new EventLog()

  process(match: Match) {
    const state = match.state

    if (
      state.phase !==
      "MAIN_LOOP"
    ) {
      return
    }

    const currentTurnPlayerId =
      state.currentTurnPlayerId

    if (!currentTurnPlayerId) {
      return
    }

    if (
      !state.currentTurnStartedAt
    ) {
      state.currentTurnStartedAt =
        Date.now()

      return
    }

    const elapsedSeconds =
      Math.floor(
        (Date.now() -
          state.currentTurnStartedAt) /
          1000
      )

    const limit =
      state.settings
        .turnTimeSeconds

    if (
      elapsedSeconds < limit
    ) {
      return
    }

    const player =
      state.playersById[
        currentTurnPlayerId
      ]

    this.eventLog.add(
      match,
      `${player.nickname} missed the turn`
    )

    this.turnEngine.moveToNextPlayer(
      match
    )
  }
}