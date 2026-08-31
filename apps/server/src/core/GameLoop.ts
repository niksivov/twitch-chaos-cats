import { Match } from "./Match"
import { MatchManager } from "./MatchManager"
import { GameBroadcaster } from "../network/GameBroadcaster"
import { TurnManager } from "./TurnManager"
import { LeaderEngine } from "./LeaderEngine"
import { EffectEngine } from "./effects/EffectEngine"
import { MatchPhase } from "./matchPhase"
import { BoosterEngine } from "./boosters/BoosterEngine"
import { EventLog } from "./events/EventLog"

export class GameLoop {
  private turnManager = new TurnManager()
  private leaderEngine = new LeaderEngine()
  private effectEngine = new EffectEngine()
  private boosterEngine = new BoosterEngine()
  private eventLog = new EventLog()

  constructor(
    private matchManager: MatchManager,
    private broadcaster: GameBroadcaster
  ) {}

  start() {
    setInterval(() => this.tick(), 1000)
  }

  private tick() {
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

    if (match.phase === MatchPhase.BOOSTER_SELECTION) {
      const timerResult = this.turnManager.processTimer(match)

      if (timerResult === "EXPIRED") {
        match.transition(MatchPhase.BOOSTER_RESOLUTION)
        this.turnManager.endTurn(match)
        match.transition(MatchPhase.TURN_END)
      }
    }

    this.effectEngine.process(match)
    this.leaderEngine.process(match)

    if (match.state.wheelResult) {
      this.broadcaster.broadcast({
        type: "wheel_result",
        payload: match.state.wheelResult,
      })
      match.state.wheelResult = null
    }

    this.broadcaster.broadcastMatchState(match)
  }

  private resetMatch(match: Match) {
    const turnTime = match.state.turnTimeSeconds
    const targetPoints = match.state.targetPoints
    const boosterSetSize = match.state.boosterSetSize

    match.reset()

    match.state.turnTimeSeconds = turnTime
    match.state.targetPoints = targetPoints
    match.state.boosterSetSize = boosterSetSize
  }

  private handleWaitingForPlayers(match: Match) {
    const playersCount = Object.keys(match.state.registeredPlayers).length

    if (playersCount >= 2) {
      match.state.registrationOpen = false
      this.startMatch(match)
    }
  }

  private handleRoundStart(match: Match) {
    match.round += 1
    match.turn = 1
    match.state.selectedBooster = null
    match.resetRoundProgress()

    this.turnManager.startRound(match)
    this.boosterEngine.initialize(match)

    this.eventLog.add(match, `🎯 Раунд ${match.round} начался`)

    match.transition(MatchPhase.TURN_START)
  }

  private handleTurnStart(match: Match) {
    match.state.selectedBooster = null

    const nextPlayerId = this.turnManager.getNextPlayerId(match)
    match.currentPlayerId = nextPlayerId

    if (!match.currentPlayerId) return

    const now = Date.now()
    const turnTimeSeconds = match.state.turnTimeSeconds ?? 15

    match.state.turnStartedAt = now
    match.state.turnEndsAt = now + turnTimeSeconds * 1000
    match.state.turnResolvedAt = null

    match.transition(MatchPhase.BOOSTER_SELECTION)
  }

  private handleBoosterSelection(match: Match) {
    if (!match.currentPlayerId) return

    const currentPlayer = match.state.registeredPlayers[match.currentPlayerId]
    if (!currentPlayer) return

    if (!currentPlayer.isAlive) {
      this.turnManager.endTurn(match)
      match.transition(MatchPhase.TURN_END)
    }
  }

  private handleBoosterResolution(match: Match) {
    this.turnManager.endTurn(match)
    match.transition(MatchPhase.TURN_END)
  }

  private handleTurnEnd(match: Match) {
    if (match.winnerId) {
      this.finishMatch(match, match.winnerId)
      return
    }

    const targetPoints = match.state.targetPoints ?? 10

    const winnerByPoints = Object.values(match.state.registeredPlayers).find(
      p => p.score >= targetPoints
    )

    if (winnerByPoints) {
      const winnerInternalId = match.getPlayerIdByTwitchId(winnerByPoints.twitchUserId)
      if (winnerInternalId) this.finishMatch(match, winnerInternalId)
      return
    }

    const activePlayers = match.getActivePlayers()

    if (activePlayers.length <= 1) {
      const winner = activePlayers[0]
      if (winner) {
        const winnerInternalId = match.getPlayerIdByTwitchId(winner.twitchUserId)
        if (winnerInternalId) this.finishMatch(match, winnerInternalId)
      }
      return
    }

    if (this.turnManager.isRoundFinished(match)) {
      match.transition(MatchPhase.ROUND_END)
      return
    }

    match.turn += 1
    match.transition(MatchPhase.TURN_START)
  }

  private handleRoundEnd(match: Match) {
    match.transition(MatchPhase.ROUND_START)
  }

  private handleMatchEnd(match: Match) {
    match.state.registeredPlayers = {}
    match.state.usedAvatarIds = []
    match.currentPlayerId = null
    match.round = 0
    match.turn = 0
  }

  private startMatch(match: Match) {
    match.state.registrationOpen = false
    match.round = 0
    match.turn = 1
    match.winnerId = null
    match.state.selectedBooster = null
    match.state.emptySince = null
    match.resetRoundProgress()

    match.transition(MatchPhase.ROUND_START)
  }

  private finishMatch(match: Match, winnerId: string) {
    match.winnerId = winnerId
    match.currentPlayerId = null
    match.state.matchEndedAt = Date.now()
    match.state.selectedBooster = null

    const winner = match.state.registeredPlayers[winnerId]
    if (winner) {
      this.eventLog.add(match, `🏆 Победитель: ${winner.username}`)
    }

    const players = Object.values(match.state.registeredPlayers)

    this.broadcaster.broadcast({
      type: "match_result",
      payload: {
        winnerId,
        reason: "points",
        players: players.map((p) => ({
          id: match.getPlayerIdByTwitchId(p.twitchUserId),
          twitchUserId: p.twitchUserId,
          username: p.username,
          avatarId: p.avatarId,
          score: p.score,
        })),
      },
    })

    match.transition(MatchPhase.MATCH_END)
  }
}