"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnManager = void 0;
const matchPhase_1 = require("./matchPhase");
class TurnManager {
    constructor() {
        this.matchTurnManagers = new Map();
    }
    /**
     * Теперь ONLY инициализирует очередь и таймер.
     * НЕ выбирает игрока сам.
     */
    startRound(match) {
        const alivePlayers = match.getAlivePlayers();
        if (alivePlayers.length === 0) {
            match.currentPlayerId = null;
            return;
        }
        // 🔹 очередь теперь internalId (пересобирается каждый старт хода)
        this.matchTurnManagers.set(match.id, Object.entries(match.state.registeredPlayers)
            .filter(([_, p]) => p.isAlive)
            .sort((a, b) => a[1].score - b[1].score)
            .map(([internalId]) => internalId));
        match.turnOrder = this.matchTurnManagers.get(match.id) ?? [];
        match.state.roundPlayedPlayerIds = [];
        this.initializeTurnTimer(match);
    }
    /**
     * Проверяет таймер, но НЕ завершает ход.
     * Только сигнализирует GameLoop.
     */
    processTimer(match) {
        if (match.phase !== matchPhase_1.MatchPhase.BOOSTER_SELECTION)
            return false;
        if (!match.state.turnEndsAt)
            return false;
        if (match.state.turnResolvedAt !== null)
            return false;
        const now = Date.now();
        if (now < match.state.turnEndsAt)
            return false;
        match.state.turnResolvedAt = now;
        return "EXPIRED";
    }
    /**
     * Теперь только помечает игрока как сыгравшего.
     */
    endTurn(match) {
        if (!match.currentPlayerId)
            return;
        const internalId = match.currentPlayerId;
        if (!match.state.roundPlayedPlayerIds.includes(internalId)) {
            match.state.roundPlayedPlayerIds.push(internalId);
        }
    }
    getCurrentPlayer(match) {
        if (!match.currentPlayerId)
            return null;
        return match.state.registeredPlayers[match.currentPlayerId] ?? null;
    }
    /**
     * Чистая логика проверки
     */
    isRoundFinished(match) {
        const alivePlayers = match.getAlivePlayers();
        return alivePlayers.every(player => {
            const internalId = match.getPlayerIdByTwitchId(player.twitchUserId);
            return internalId
                ? match.state.roundPlayedPlayerIds.includes(internalId)
                : false;
        });
    }
    /**
     * Больше НЕ управляет state
     * только возвращает данные
     */
    getNextPlayerId(match) {
        const alivePlayers = match.getAlivePlayers();
        if (alivePlayers.length === 0)
            return null;
        const roundPlayed = match.state.roundPlayedPlayerIds;
        const queue = this.matchTurnManagers.get(match.id) ?? [];
        // 1. ищем следующего живого, который ещё не ходил
        const nextFromUnplayed = queue.find(id => {
            const player = match.state.registeredPlayers[id];
            return player?.isAlive && !roundPlayed.includes(id);
        });
        if (nextFromUnplayed) {
            return nextFromUnplayed;
        }
        // 2. fallback — первый живой игрок
        const nextAlive = queue.find(id => {
            const player = match.state.registeredPlayers[id];
            return player?.isAlive;
        });
        return nextAlive ?? null;
    }
    getRemainingSeconds(match) {
        if (!match.state.turnEndsAt)
            return 0;
        const diff = match.state.turnEndsAt - Date.now();
        return Math.max(0, Math.ceil(diff / 1000));
    }
    resetTimer(match) {
        match.state.turnStartedAt = null;
        match.state.turnEndsAt = null;
        match.state.turnResolvedAt = null;
    }
    initializeTurnTimer(match) {
        const now = Date.now();
        const turnTimeSeconds = match.state.turnTimeSeconds ?? 15;
        match.state.turnStartedAt = now;
        match.state.turnEndsAt = now + turnTimeSeconds * 1000;
        match.state.turnResolvedAt = null;
    }
}
exports.TurnManager = TurnManager;
