import { Match } from "./Match"

import { BoosterRegistry } from "./boosters/BoosterRegistry"

import { EventLog } from "./events/EventLog"

import { TurnManager } from "./TurnManager"

import { updateMatchState } from "./updateMatchState"

const boosterRegistry =
  new BoosterRegistry()

const eventLog =
  new EventLog()

interface Params {
  match: Match

  turnManager: TurnManager

  playerId: string

  slot: number
}

export function handleBoosterSelection({
  match,
  turnManager,
  playerId,
  slot,
}: Params) {
  const state = match.state

  if (
    state.phase !== "MAIN_LOOP"
  ) {
    return
  }

  const player =
    state.playersById[playerId]

  if (!player) {
    return
  }

  if (player.eliminated) {
    return
  }

  const isCurrentPlayer =
    turnManager.isCurrentPlayer(
      playerId
    )

  if (!isCurrentPlayer) {
    return
  }

  const boosterSlot =
    state.boosterSet.find(
      (entry) => {
        return (
          entry.slot === slot
        )
      }
    )

  if (!boosterSlot) {
    return
  }

  if (boosterSlot.used) {
    return
  }

  const booster =
    boosterRegistry.getById(
      boosterSlot.boosterId
    )

  if (!booster) {
    return
  }

  booster.execute({
    match,

    sourcePlayerId:
      playerId,
  })

  boosterSlot.used = true

  eventLog.add(
    match,
    `${player.nickname} used ${booster.name}`
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