import { Match } from "./Match"

export class TurnEngine {
  process(match: Match) {
    const state = match.state

    if (
      state.phase !==
      "MAIN_LOOP"
    ) {
      return
    }

    const alivePlayers =
      state.playerOrder.filter(
        (playerId) => {
          const player =
            state.playersById[
              playerId
            ]

          return !player.eliminated
        }
      )

    if (
      alivePlayers.length === 0
    ) {
      return
    }

    if (
      !state.currentTurnPlayerId
    ) {
      state.currentTurnPlayerId =
        alivePlayers[0]

      state.currentTurnStartedAt =
        Date.now()

      return
    }

    const currentStillAlive =
      alivePlayers.includes(
        state.currentTurnPlayerId
      )

    if (
      !currentStillAlive
    ) {
      state.currentTurnPlayerId =
        alivePlayers[0]

      state.currentTurnStartedAt =
        Date.now()
    }
  }

  moveToNextPlayer(
    match: Match
  ) {
    const state = match.state

    const alivePlayers =
      state.playerOrder.filter(
        (playerId) => {
          const player =
            state.playersById[
              playerId
            ]

          return !player.eliminated
        }
      )

    if (
      alivePlayers.length === 0
    ) {
      return
    }

    if (
      !state.currentTurnPlayerId
    ) {
      state.currentTurnPlayerId =
        alivePlayers[0]

      state.currentTurnStartedAt =
        Date.now()

      return
    }

    const currentIndex =
      alivePlayers.indexOf(
        state.currentTurnPlayerId
      )

    const nextIndex =
      (currentIndex + 1) %
      alivePlayers.length

    state.currentTurnPlayerId =
      alivePlayers[nextIndex]

    state.currentTurnStartedAt =
      Date.now()
  }
}