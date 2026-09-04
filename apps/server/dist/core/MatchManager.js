"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchManager = void 0;
const crypto_1 = require("crypto");
const Match_1 = require("./Match");
class MatchManager {
    constructor() {
        this.matches = new Map();
        // 🔹 NEW: ссылка на TwitchBotService (опционально)
        this.twitchBotService = null;
    }
    // 🔹 NEW: подключение TwitchBotService (минимальный безопасный хук)
    setTwitchBotService(service) {
        this.twitchBotService = service;
    }
    // Создать новый матч с настройками Twitch
    createMatch(settings) {
        console.log("CREATE MATCH SETTINGS:", settings);
        const matchId = (0, crypto_1.randomUUID)();
        const match = new Match_1.Match(matchId, settings);
        console.log('[1] AFTER NEW MATCH:', match.state);
        console.log('[1] STATE AFTER NEW MATCH:', match.state);
        match.state.twitchChannel = settings.twitchChannel;
        match.state.maxPlayers = settings.maxPlayers;
        match.state.turnTimeSeconds = settings.turnTimeSeconds ?? 30;
        match.state.targetPoints = settings.targetPoints ?? 10;
        match.state.boosterSetSize = settings.boosterSetSize ?? 3;
        match.state.registrationOpen = true;
        this.matches.set(matchId, match);
        console.log('[2] BEFORE RETURNING MATCH:', match.state);
        // 🔹 NEW: уведомление TwitchBotService сразу после создания матча
        if (this.twitchBotService?.setCurrentMatch) {
            console.log("[MATCH MANAGER] notifying TwitchBotService:", matchId);
            this.twitchBotService.setCurrentMatch(matchId);
        }
        return match;
    }
    getMatch(matchId) {
        return this.matches.get(matchId) ?? null;
    }
    getAllMatches() {
        return Array.from(this.matches.values());
    }
    removeMatch(matchId) {
        this.matches.delete(matchId);
    }
    // Регистрация Twitch-игрока через !join
    registerTwitchPlayer(matchId, twitchUserId, username, avatarId) {
        const match = this.matches.get(matchId);
        if (!match)
            return null;
        return match.addTwitchPlayer(twitchUserId, username, avatarId);
    }
    // Удаление игрока (например при выбывании)
    removePlayer(matchId, twitchUserId) {
        const match = this.matches.get(matchId);
        if (!match)
            return;
        match.eliminatePlayer(twitchUserId);
    }
    // Проверка, нужно ли удалить пустые матчи
    cleanupEmptyMatches() {
        for (const [matchId, match] of this.matches) {
            if (Object.keys(match.state.registeredPlayers).length === 0 && match.phase === "WAITING_FOR_PLAYERS") {
                this.removeMatch(matchId);
            }
        }
    }
    // Синхронизация состояния матча после сброса
    resetMatch(matchId) {
        const match = this.matches.get(matchId);
        if (!match)
            return;
        match.reset();
    }
}
exports.MatchManager = MatchManager;
