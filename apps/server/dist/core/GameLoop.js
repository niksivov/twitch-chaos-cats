"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLoop = void 0;
const TurnManager_1 = require("./TurnManager");
const LeaderEngine_1 = require("./LeaderEngine");
const EffectEngine_1 = require("./effects/EffectEngine");
const matchPhase_1 = require("./matchPhase");
const BoosterEngine_1 = require("./boosters/BoosterEngine");
const EventLog_1 = require("./events/EventLog");
class GameLoop {
    constructor(matchManager, broadcaster) {
        this.matchManager = matchManager;
        this.broadcaster = broadcaster;
        this.turnManager = new TurnManager_1.TurnManager();
        this.leaderEngine = new LeaderEngine_1.LeaderEngine();
        this.effectEngine = new EffectEngine_1.EffectEngine();
        this.boosterEngine = new BoosterEngine_1.BoosterEngine();
        this.eventLog = new EventLog_1.EventLog();
    }
    start() {
        setInterval(() => this.tick(), 1000);
    }
    tick() {
        const matches = this.matchManager.getAllMatches();
        for (const match of matches) {
            this.processMatch(match);
        }
        this.matchManager.cleanupEmptyMatches();
    }
    processMatch(match) {
        if (match.isAbandoned() || match.shouldReset()) {
            this.resetMatch(match);
            return;
        }
        if (match.state.paused)
            return;
        if (match.winnerId && match.phase !== matchPhase_1.MatchPhase.MATCH_END) {
            this.finishMatch(match, match.winnerId);
            return;
        }
        match.state.tick++;
        switch (match.phase) {
            case matchPhase_1.MatchPhase.WAITING_FOR_PLAYERS:
                this.handleWaitingForPlayers(match);
                break;
            case matchPhase_1.MatchPhase.ROUND_START:
                this.handleRoundStart(match);
                break;
            case matchPhase_1.MatchPhase.TURN_START:
                this.handleTurnStart(match);
                break;
            case matchPhase_1.MatchPhase.BOOSTER_SELECTION:
                this.handleBoosterSelection(match);
                break;
            case matchPhase_1.MatchPhase.BOOSTER_RESOLUTION:
                this.handleBoosterResolution(match);
                break;
            case matchPhase_1.MatchPhase.TURN_END:
                this.handleTurnEnd(match);
                break;
            case matchPhase_1.MatchPhase.ROUND_END:
                this.handleRoundEnd(match);
                break;
            case matchPhase_1.MatchPhase.MATCH_END:
                this.handleMatchEnd(match);
                break;
        }
        if (match.phase === matchPhase_1.MatchPhase.BOOSTER_SELECTION) {
            const timerResult = this.turnManager.processTimer(match);
            if (timerResult === "EXPIRED") {
                match.transition(matchPhase_1.MatchPhase.BOOSTER_RESOLUTION);
                this.turnManager.endTurn(match);
                match.transition(matchPhase_1.MatchPhase.TURN_END);
            }
        }
        this.effectEngine.process(match);
        this.leaderEngine.process(match);
        if (match.state.wheelResult) {
            this.broadcaster.broadcast({
                type: "wheel_result",
                roomId: match.state.twitchChannel,
                payload: match.state.wheelResult,
            });
            match.state.wheelResult = null;
        }
        if (match.state.pandoraResult) {
            this.broadcaster.broadcast({
                type: "pandora_result",
                roomId: match.state.twitchChannel,
                payload: match.state.pandoraResult,
            });
            match.state.pandoraResult = null;
        }
        this.broadcaster.broadcastMatchState(match);
    }
    resetMatch(match) {
        const turnTime = match.state.turnTimeSeconds;
        const targetPoints = match.state.targetPoints;
        const boosterSetSize = match.state.boosterSetSize;
        match.reset();
        match.state.turnTimeSeconds = turnTime;
        match.state.targetPoints = targetPoints;
        match.state.boosterSetSize = boosterSetSize;
    }
    handleWaitingForPlayers(match) {
        const playersCount = Object.keys(match.state.registeredPlayers).length;
        if (playersCount >= 2) {
            match.state.registrationOpen = false;
            this.startMatch(match);
        }
    }
    handleRoundStart(match) {
        match.round += 1;
        match.turn = 1;
        match.state.selectedBooster = null;
        match.resetRoundProgress();
        this.turnManager.startRound(match);
        this.boosterEngine.initialize(match);
        this.eventLog.add(match, `🎯 Раунд ${match.round} начался`);
        match.transition(matchPhase_1.MatchPhase.TURN_START);
    }
    handleTurnStart(match) {
        match.state.selectedBooster = null;
        const nextPlayerId = this.turnManager.getNextPlayerId(match);
        match.currentPlayerId = nextPlayerId;
        if (!match.currentPlayerId)
            return;
        const now = Date.now();
        const turnTimeSeconds = match.state.turnTimeSeconds ?? 15;
        match.state.turnStartedAt = now;
        match.state.turnEndsAt = now + turnTimeSeconds * 1000;
        match.state.turnResolvedAt = null;
        match.transition(matchPhase_1.MatchPhase.BOOSTER_SELECTION);
    }
    handleBoosterSelection(match) {
        if (!match.currentPlayerId)
            return;
        const currentPlayer = match.state.registeredPlayers[match.currentPlayerId];
        if (!currentPlayer)
            return;
        if (!currentPlayer.isAlive) {
            this.turnManager.endTurn(match);
            match.transition(matchPhase_1.MatchPhase.TURN_END);
        }
    }
    handleBoosterResolution(match) {
        this.turnManager.endTurn(match);
        match.transition(matchPhase_1.MatchPhase.TURN_END);
    }
    handleTurnEnd(match) {
        if (match.winnerId) {
            this.finishMatch(match, match.winnerId);
            return;
        }
        const targetPoints = match.state.targetPoints ?? 10;
        const winnerByPoints = Object.values(match.state.registeredPlayers).find(p => p.score >= targetPoints);
        if (winnerByPoints) {
            const winnerInternalId = match.getPlayerIdByTwitchId(winnerByPoints.twitchUserId);
            if (winnerInternalId)
                this.finishMatch(match, winnerInternalId);
            return;
        }
        const activePlayers = match.getActivePlayers();
        if (activePlayers.length <= 1) {
            const winner = activePlayers[0];
            if (winner) {
                const winnerInternalId = match.getPlayerIdByTwitchId(winner.twitchUserId);
                if (winnerInternalId)
                    this.finishMatch(match, winnerInternalId);
            }
            return;
        }
        if (this.turnManager.isRoundFinished(match)) {
            match.transition(matchPhase_1.MatchPhase.ROUND_END);
            return;
        }
        match.turn += 1;
        match.transition(matchPhase_1.MatchPhase.TURN_START);
    }
    handleRoundEnd(match) {
        match.transition(matchPhase_1.MatchPhase.ROUND_START);
    }
    handleMatchEnd(match) {
        match.state.registeredPlayers = {};
        match.state.usedAvatarIds = [];
        match.currentPlayerId = null;
        match.round = 0;
        match.turn = 0;
    }
    startMatch(match) {
        match.state.registrationOpen = false;
        match.round = 0;
        match.turn = 1;
        match.winnerId = null;
        match.state.selectedBooster = null;
        match.state.emptySince = null;
        match.resetRoundProgress();
        match.transition(matchPhase_1.MatchPhase.ROUND_START);
    }
    finishMatch(match, winnerId) {
        match.winnerId = winnerId;
        match.currentPlayerId = null;
        match.state.matchEndedAt = Date.now();
        match.state.selectedBooster = null;
        const winner = match.state.registeredPlayers[winnerId];
        if (winner) {
            this.eventLog.add(match, `🏆 Победитель: ${winner.username}`);
        }
        const players = Object.values(match.state.registeredPlayers);
        this.broadcaster.broadcast({
            type: "match_result",
            roomId: match.state.twitchChannel,
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
        });
        match.transition(matchPhase_1.MatchPhase.MATCH_END);
    }
}
exports.GameLoop = GameLoop;
