import { Match } from "./Match"

import { TurnManager } from "./TurnManager"

import { EventLog } from "./events/EventLog"

import { generateBoosterSet } from "./boosters/generateBoosterSet"

const eventLog =
  new EventLog()

interface Params {
  match: Match

  turnManager: TurnManager
}

export function updateMatchState({
  match,
  turnManager,
}: Params) {
  const state = match.state

  const alivePlayers =
    state.playerOrder
      .map((playerId) => {
        return state.playersById[
          playerId
        ]
      })
      .filter((player) => {
        return !player.eliminated
      })

  if (
    alivePlayers.length <= 1
  ) {
    state.phase = "FINISHED"

    const winner =
      alivePlayers[0]

    if (winner) {
      eventLog.add(
        match,
        `${winner.nickname} won the match`
      )
    }

    return
  }

  const roundFinished =
    turnManager.isRoundFinished()

  if (!roundFinished) {
    return
  }

  state.round++

  state.boosterSet =
    generateBoosterSet()

  const alive =
    alivePlayers.filter(
      (player) => {
        return !player.eliminated
      }
    )

  turnManager.setup(
    alive,
    state.round
  )

  const currentPlayer =
    turnManager.getCurrentPlayer()

  state.currentTurnPlayerId =
    currentPlayer?.id

  state.currentTurnStartedAt =
    turnManager.getCurrentTurnStartedAt()

  eventLog.add(
    match,
    `Round ${state.round} started`
  )
}