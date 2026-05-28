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
  }

  private processMatch(match: Match) {
    const state = match.state

    if (state.paused) {
      return
    }

    state.tick++

    this.phaseEngine.process(match)

    this.roundEngine.process(match)

    this.turnEngine.process(match)

    this.turnTimerEngine.process(
      match
    )

    this.effectEngine.process(match)

    this.leaderEngine.process(match)

    this.broadcaster.broadcastMatchState(
      match
    )
  }
}