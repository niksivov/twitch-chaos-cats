"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const crypto_1 = require("crypto");
const matchPhase_1 = require("./matchPhase");
const MatchStateMachine_1 = require("./MatchStateMachine");
const EMPTY_MATCH_TIMEOUT_MS = 60000;
const MATCH_RESET_DELAY_MS = 5000;
class Match {
    constructor(matchId, settings) {
        this.turnOrder = [];
        // 🔹 Twitch → internal playerId mapping
        this.twitchToPlayerId = {};
        console.log('[MATCH ctor 0] settings IN:', settings);
        this.id = matchId;
        this.phase = matchPhase_1.MatchPhase.WAITING_FOR_PLAYERS;
        this.round = 0;
        this.turn = 0;
        this.currentPlayerId = null;
        this.winnerId = null;
        this.state = {
            runtimeId: (0, crypto_1.randomUUID)(),
            tick: 0,
            paused: false,
            leaderId: null,
            selectedBooster: null,
            turnStartedAt: null,
            turnEndsAt: null,
            turnResolvedAt: null,
            matchEndedAt: null,
            emptySince: null,
            boosterPool: [],
            boosterSet: [],
            effects: [],
            eventLog: [],
            recentEvents: [],
            roundPlayedPlayerIds: [],
            registeredPlayers: {},
            usedAvatarIds: [],
            twitchChannel: null,
            maxPlayers: 0,
            registrationOpen: false,
            turnTimeSeconds: settings?.turnTimeSeconds ?? 30,
            targetPoints: settings?.targetPoints ?? 10,
            boosterSetSize: settings?.boosterSetSize ?? 3,
            exhaustiblePool: settings?.exhaustiblePool ?? true,
        };
        console.log('[MATCH ctor 1] state AFTER init:', {
            twitchChannel: this.state.twitchChannel,
            maxPlayers: this.state.maxPlayers,
            turnTimeSeconds: this.state.turnTimeSeconds,
            targetPoints: this.state.targetPoints,
            boosterSetSize: this.state.boosterSetSize,
        });
        this.stateMachine = new MatchStateMachine_1.MatchStateMachine(this.phase);
        console.log('[MATCH ctor 2] FINAL STATE SNAPSHOT:', this.state);
    }
    // 🔹 получение игрока по Twitch ID
    getPlayerByTwitchId(twitchUserId) {
        const playerId = this.twitchToPlayerId[twitchUserId];
        if (!playerId)
            return null;
        return this.state.registeredPlayers[playerId] ?? null;
    }
    // 🔹 NEW: получение internal playerId по Twitch ID
    getPlayerIdByTwitchId(twitchUserId) {
        return this.twitchToPlayerId[twitchUserId] ?? null;
    }
    get players() {
        return Object.values(this.state.registeredPlayers);
    }
    toJSON() {
        return {
            id: this.id,
            phase: this.phase,
            round: this.round,
            turn: this.turn,
            turnOrder: this.turnOrder,
            // 👇 currentTurnPlayerId теперь internalId
            currentTurnPlayerId: this.currentPlayerId,
            currentTurnStartedAt: this.state.turnStartedAt,
            leaderId: this.state.leaderId,
            // 👇 добавлен id для фронта
            players: Object.entries(this.state.registeredPlayers).map(([internalId, p]) => ({
                id: internalId,
                twitchUserId: p.twitchUserId,
                username: p.username,
                avatarId: p.avatarId,
                score: p.score,
                isAlive: p.isAlive,
            })),
            boosterSet: this.state.boosterSet,
            recentEvents: this.state.eventLog,
            // ↓ новые поля для фронта
            matchFinished: this.winnerId !== null,
            matchWinnerId: this.winnerId,
            matchPlayers: Object.entries(this.state.registeredPlayers).map(([internalId, p]) => ({
                id: internalId,
                twitchUserId: p.twitchUserId,
                username: p.username,
                avatarId: p.avatarId,
                score: p.score,
                isAlive: p.isAlive,
            })),
            matchWinReason: this.state.matchEndedAt ? "points" : undefined,
        };
    }
    transition(next) {
        this.stateMachine.transition(next);
        this.phase = next;
    }
    addTwitchPlayer(twitchUserId, username, avatarId) {
        if (!this.state.registrationOpen)
            return null;
        if (Object.keys(this.state.registeredPlayers).length >= this.state.maxPlayers)
            return null;
        if (this.state.registeredPlayers[twitchUserId])
            return null;
        const internalId = (0, crypto_1.randomUUID)();
        const player = {
            playerId: internalId,
            twitchUserId,
            username,
            avatarId,
            score: 0,
            isAlive: true,
        };
        this.twitchToPlayerId[twitchUserId] = internalId;
        this.state.registeredPlayers[internalId] = player;
        this.state.usedAvatarIds.push(avatarId);
        return player;
    }
    getActivePlayers() {
        return Object.values(this.state.registeredPlayers).filter(p => p.isAlive);
    }
    getAlivePlayers() {
        return this.getActivePlayers();
    }
    eliminatePlayer(twitchUserId) {
        const player = this.getPlayerByTwitchId(twitchUserId);
        if (!player)
            return;
        player.isAlive = false;
    }
    markCurrentPlayerAsPlayed() {
        if (!this.currentPlayerId)
            return;
        if (this.state.roundPlayedPlayerIds.includes(this.currentPlayerId))
            return;
        this.state.roundPlayedPlayerIds.push(this.currentPlayerId);
    }
    hasRoundFinished() {
        const active = this.getActivePlayers();
        return active.every(p => this.state.roundPlayedPlayerIds.includes(p.twitchUserId));
    }
    resetRoundProgress() {
        this.state.roundPlayedPlayerIds = [];
    }
    // 🔴 FIX: теперь currentPlayerId всегда internalId
    setCurrentPlayer(twitchUserId) {
        const internalId = this.twitchToPlayerId[twitchUserId];
        this.currentPlayerId = internalId ?? null;
    }
    reset() {
        this.transition(matchPhase_1.MatchPhase.RESETTING);
        this.round = 0;
        this.turn = 0;
        this.currentPlayerId = null;
        this.winnerId = null;
        this.state.tick = 0;
        this.state.paused = false;
        this.state.leaderId = null;
        this.state.selectedBooster = null;
        this.state.turnStartedAt = null;
        this.state.turnEndsAt = null;
        this.state.turnResolvedAt = null;
        this.state.matchEndedAt = null;
        this.state.emptySince = null;
        this.state.boosterPool = [];
        this.state.boosterSet = [];
        this.state.effects = [];
        this.state.eventLog = [];
        this.state.roundPlayedPlayerIds = [];
        this.state.registeredPlayers = {};
        this.state.usedAvatarIds = [];
        this.state.twitchChannel = null;
        this.state.maxPlayers = 0;
        this.state.registrationOpen = false;
        this.transition(matchPhase_1.MatchPhase.WAITING_FOR_PLAYERS);
    }
    isAbandoned() {
        if (this.state.emptySince === null)
            return false;
        return Date.now() - this.state.emptySince > EMPTY_MATCH_TIMEOUT_MS;
    }
    shouldReset() {
        if (!this.state.matchEndedAt)
            return false;
        return Date.now() - this.state.matchEndedAt > MATCH_RESET_DELAY_MS;
    }
}
exports.Match = Match;
