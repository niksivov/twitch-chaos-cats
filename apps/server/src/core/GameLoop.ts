import { Match } from "./Match"

import { MatchManager } from "./MatchManager"

import { CommandProcessor } from "./CommandProcessor"

import { GameBroadcaster } from "../network/GameBroadcaster"

import { TurnEngine } from "./TurnEngine"

import { LeaderEngine } from "./LeaderEngine"

import { PhaseEngine } from "./PhaseEngine"

import { EffectEngine } from "./effects/EffectEngine"

import { RoundEngine } from "./RoundEngine"

import { TurnTimerEngine } from "./TurnTimerEngine"

import { MatchPhase } from "./matchPhase"

import { BoosterEngine } from "./boosters/BoosterEngine"

export class GameLoop {
  private turnEngine =
    new TurnEngine()

  private leaderEngine =
    new LeaderEngine()

  private phaseEngine =
    new PhaseEngine()

  private effectEngine =
    new EffectEngine()

  private roundEngine =
    new RoundEngine()

  private turnTimerEngine =
    new TurnTimerEngine()

  private boosterEngine =
    new BoosterEngine()

  constructor(
    private matchManager: MatchManager,

    private commandProcessor: CommandProcessor,

    private broadcaster: GameBroadcaster
  ) {}

  start() {
    setInterval(() => {
      this.tick()
    }, 1000)
  }

  private tick() {
    this.commandProcessor.process()

    const matches =
      this.matchManager.getAllMatches()

    for (const match of matches) {
      this.processMatch(match)
    }

    this.matchManager.cleanupEmptyMatches()
  }

  private processMatch(match: Match) {
    const state = match.state

    if (state.paused) {
      return
    }

    state.tick++

    switch (match.phase) {
      case MatchPhase.WAITING_FOR_PLAYERS:
        this.handleWaitingForPlayers(
          match
        )
        break

      case MatchPhase.STARTING:
        this.handleStarting(match)
        break

      case MatchPhase.ROUND_START:
        this.handleRoundStart(match)
        break

      case MatchPhase.TURN_START:
        this.handleTurnStart(match)
        break

      case MatchPhase.BOOSTER_SELECTION:
        this.handleBoosterSelection(
          match
        )
        break

      case MatchPhase.BOOSTER_RESOLUTION:
        this.handleBoosterResolution(
          match
        )
        break

      case MatchPhase.TURN_END:
        this.handleTurnEnd(match)
        break

      case MatchPhase.ROUND_END:
        this.handleRoundEnd(match)
        break

      case MatchPhase.MATCH_END:
        this.handleMatchEnd(match)
        break

      case MatchPhase.RESETTING:
        this.handleResetting(match)
        break
    }

    this.turnTimerEngine.process(
      match
    )

    this.effectEngine.process(
      match
    )

    this.leaderEngine.process(
      match
    )

    this.phaseEngine.process(
      match
    )

    this.broadcaster.broadcastMatchState(
      match
    )
  }

  private handleWaitingForPlayers(
    match: Match
  ) {
    if (
      match.players.length >= 2
    ) {
      this.boosterEngine.initialize(
        match
      )

      match.start()
    }
  }

  private handleStarting(
    match: Match
  ) {
    match.transition(
      MatchPhase.ROUND_START
    )
  }

  private handleRoundStart(
    match: Match
  ) {
    this.roundEngine.process(
      match
    )

    match.transition(
      MatchPhase.TURN_START
    )
  }

  private handleTurnStart(
    match: Match
  ) {
    this.turnEngine.process(
      match
    )

    match.transition(
      MatchPhase.BOOSTER_SELECTION
    )
  }

  private handleBoosterSelection(
    match: Match
  ) {}

  private handleBoosterResolution(
    match: Match
  ) {
    match.transition(
      MatchPhase.TURN_END
    )
  }

  private handleTurnEnd(
    match: Match
  ) {
    const alivePlayers =
      match.getAlivePlayers()

    if (alivePlayers.length <= 1) {
      const winner =
        alivePlayers[0]

      if (winner) {
        match.finish(
          winner.id
        )
      }

      return
    }

    match.turn += 1

    match.transition(
      MatchPhase.TURN_START
    )
  }

  private handleRoundEnd(
    match: Match
  ) {
    match.round += 1

    match.transition(
      MatchPhase.ROUND_START
    )
  }

  private handleMatchEnd(
    match: Match
  ) {
    setTimeout(() => {
      match.reset()
    }, 5000)
  }

  private handleResetting(
    match: Match
  ) {
    match.reset()
  }
}