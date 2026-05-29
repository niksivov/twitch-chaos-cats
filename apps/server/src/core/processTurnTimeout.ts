import { Match } from "./Match"

import { TurnManager } from "./TurnManager"

import { EventLog } from "./events/EventLog"

import { updateMatchState } from "./updateMatchState"

const eventLog =
  new EventLog()

interface Params {
  match: Match

  turnManager: TurnManager

  turnDurationMs: number
}

export function processTurnTimeout({
  match,
  turnManager,
  turnDurationMs,
}: Params) {
  const state = match.state

  if (
    state.phase !== "MAIN_LOOP"
  ) {
    return
  }

  const currentPlayer =
    turnManager.getCurrentPlayer()

  if (!currentPlayer) {
    return
  }

  const startedAt =
    turnManager.getCurrentTurnStartedAt()

  const now = Date.now()

  const elapsed =
    now - startedAt

  const expired =
    elapsed >= turnDurationMs

  if (!expired) {
    return
  }

  eventLog.add(
    match,
    `${currentPlayer.nickname} skipped the turn`
  )

  turnManager.nextTurn()

  const nextPlayer =
    turnManager.getCurrentPlayer()

  state.currentTurnPlayerId =
    nextPlayer?.id

  state.currentTurnStartedAt =
    turnManager.getCurrentTurnStartedAt()

  updateMatchState({
    match,

    turnManager,
  })
}