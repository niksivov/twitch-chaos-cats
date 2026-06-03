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
import { EventLog } from "./events/EventLog"

export class GameLoop {
  private turnEngine = new TurnEngine()
  private leaderEngine = new LeaderEngine()
  private phaseEngine = new PhaseEngine()
  private effectEngine = new EffectEngine()
  private roundEngine = new RoundEngine()
  private turnTimerEngine = new TurnTimerEngine()
  private boosterEngine = new BoosterEngine()
  private eventLog = new EventLog()

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
    const matches = this.matchManager.getAllMatches()
    for (const match of matches) {
      this.processMatch(match)
    }
    this.matchManager.cleanupEmptyMatches()
  }

  private processMatch(match: Match) {
    if (match.isAbandoned() || match.shouldReset()) {
      this.resetMatch(match)
      return
    }

    if (match.state.paused) return
    match.state.tick++

    switch (match.phase) {
      case MatchPhase.WAITING_FOR_PLAYERS:
        this.handleWaitingForPlayers(match)
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
        this.handleBoosterSelection(match)
        break
      case MatchPhase.BOOSTER_RESOLUTION:
        this.handleBoosterResolution(match)
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
    }

    this.turnTimerEngine.process(match)
    this.effectEngine.process(match)
    this.leaderEngine.process(match)
    this.phaseEngine.process(match)
    this.broadcaster.broadcastMatchState(match)
  }

  private resetMatch(match: Match) {
    match.reset()
    this.matchManager.syncMatchRuntime(match.id)
  }

  private handleWaitingForPlayers(match: Match) {
    if (match.players.length >= 2) {
      const state = match.state as any
      state.turnTimeSeconds = state.turnTimeSeconds ?? 15
      state.targetPoints = state.targetPoints ?? 10
      state.boosterSetSize = state.boosterSetSize ?? 3

      this.boosterEngine.initialize(match)
      match.start()
    }
  }

  private handleStarting(match: Match) {
    match.transition(MatchPhase.ROUND_START)
  }

  private handleRoundStart(match: Match) {
    match.resetRoundProgress()
    this.eventLog.add(match, `⚔️ Начался ${match.round} раунд`)
    this.boosterEngine.initialize(match)
    this.roundEngine.process(match)
    match.transition(MatchPhase.TURN_START)
  }

  private handleTurnStart(match: Match) {
    match.state.turnResolvedAt = null
    match.state.selectedBooster = null
    this.turnEngine.startTurn(match)

    if (!match.currentPlayerId) return
    const currentPlayer = match.state.playersById[match.currentPlayerId]
    if (!currentPlayer) return

    if (!match.isPlayerActive(currentPlayer)) {
      match.markCurrentPlayerAsPlayed()
      match.transition(MatchPhase.TURN_END)
      return
    }

    match.state.turnStartedAt = Date.now()
    const turnTime = (match.state as any).turnTimeSeconds ?? 15
    match.state.turnEndsAt = Date.now() + turnTime * 1000
    match.transition(MatchPhase.BOOSTER_SELECTION)
  }

  private handleBoosterSelection(match: Match) {
    if (!match.currentPlayerId) return
    const currentPlayer = match.state.playersById[match.currentPlayerId]
    if (!currentPlayer) return

    if (!match.isPlayerActive(currentPlayer)) {
      match.markCurrentPlayerAsPlayed()
      match.state.turnResolvedAt = Date.now()
      match.transition(MatchPhase.TURN_END)
    }
  }

  private handleBoosterResolution(match: Match) {
    match.markCurrentPlayerAsPlayed()
    match.transition(MatchPhase.TURN_END)
  }

  private handleTurnEnd(match: Match) {
    // ✅ Мгновенная победа по очкам
    const targetPoints = (match.state as any).targetPoints ?? 10
    const winnerByPoints = match.players.find(p => p.score >= targetPoints)
    if (winnerByPoints) {
      match.finish(winnerByPoints.id)
      this.eventLog.add(match, `🏆 ${winnerByPoints.username} победил с ${winnerByPoints.score} очками`)
      return
    }

    const activePlayers = match.getActivePlayers()
    if (activePlayers.length <= 1) {
      const winner = activePlayers[0]
      if (winner) match.finish(winner.id)
      return
    }

    if (match.hasRoundFinished()) {
      match.transition(MatchPhase.ROUND_END)
      return
    }

    match.turn += 1
    match.transition(MatchPhase.TURN_START)
  }

  private handleRoundEnd(match: Match) {
    match.round += 1
    match.currentPlayerId = null
    match.transition(MatchPhase.ROUND_START)
  }

  private handleMatchEnd(match: Match) {
    this.eventLog.add(match, `🏆 Победитель: ${match.winnerId}`)
  }
}