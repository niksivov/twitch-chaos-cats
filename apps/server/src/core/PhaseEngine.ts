import { Match } from "./Match"

import { BoosterSetManager } from "./boosters/BoosterSetManager"

export class PhaseEngine {
  private boosterSetManager =
    new BoosterSetManager()

  private cleanupDelayMs =
    60000

  process(match: Match) {
    const state = match.state

    switch (state.phase) {
      case "LOBBY":
        this.processLobby(match)
        break

      case "PREPARATION":
        this.processPreparation(match)
        break

      case "MAIN_LOOP":
        this.processMainLoop(match)
        break

      case "ENDGAME":
        this.processEndgame(match)
        break

      case "FINISHED":
        this.processFinished(match)
        break
    }
  }

  private processLobby(
    match: Match
  ) {
    const state = match.state

    const playerCount =
      state.playerOrder.length

    if (playerCount < 2) {
      return
    }

    state.phase =
      "PREPARATION"

    state.startedAt =
      Date.now()

    state.tick = 0

    state.round = 1

    this.boosterSetManager.initialize(
      match
    )

    console.log(
      `[${state.roomId}] preparation started`
    )
  }

  private processPreparation(
    match: Match
  ) {
    const state = match.state

    if (state.tick < 5) {
      return
    }

    state.phase =
      "MAIN_LOOP"

    state.tick = 0

    state.round = 1

    console.log(
      `[${state.roomId}] main loop started`
    )
  }

  private processMainLoop(
    match: Match
  ) {
    const state = match.state

    const alivePlayers =
      state.playerOrder.filter((playerId) => {
        const player =
          state.playersById[playerId]

        return !player.eliminated
      })

    if (alivePlayers.length <= 1) {
      state.phase =
        "ENDGAME"

      state.tick = 0

      console.log(
        `[${state.roomId}] endgame started`
      )
    }
  }

  private processEndgame(
    match: Match
  ) {
    const state = match.state

    if (state.tick < 5) {
      return
    }

    state.phase =
      "FINISHED"

    state.finishedAt =
      Date.now()

    state.tick = 0

    console.log(
      `[${state.roomId}] match finished`
    )
  }

  private processFinished(
    match: Match
  ) {
    const state = match.state

    if (!state.finishedAt) {
      return
    }

    const elapsed =
      Date.now() -
      state.finishedAt

    if (
      elapsed <
      this.cleanupDelayMs
    ) {
      return
    }

    this.resetMatch(match)
  }

  private resetMatch(
    match: Match
  ) {
    const state = match.state

    state.phase =
      "LOBBY"

    state.tick = 0

    state.round = 1

    state.playersById = {}

    state.playerOrder = []

    state.currentTurnPlayerId =
      undefined

    state.currentTurnStartedAt =
      undefined

    state.leaderPlayerId =
      undefined

    state.recentEvents = []

    state.boosterSet = []

    state.startedAt =
      undefined

    state.finishedAt =
      undefined

    console.log(
      `[${state.roomId}] match reset`
    )
  }
}