"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchManager = void 0;
const crypto_1 = require("crypto");
const Match_1 = require("./Match");
class MatchManager {
    constructor() {
        this.matches = new Map();
    }
    createMatch(settings) {
        const matchId = (0, crypto_1.randomUUID)();
        const match = new Match_1.Match(matchId, settings);
        match.state.twitchChannel = settings.twitchChannel;
        match.state.maxPlayers = settings.maxPlayers;
        match.state.turnTimeSeconds = settings.turnTimeSeconds ?? 30;
        match.state.targetPoints = settings.targetPoints ?? 10;
        match.state.boosterSetSize = settings.boosterSetSize ?? 3;
        match.state.registrationOpen = true;
        this.matches.set(matchId, match);
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
    registerTwitchPlayer(matchId, twitchUserId, username, avatarId) {
        const match = this.matches.get(matchId);
        if (!match)
            return null;
        return match.addTwitchPlayer(twitchUserId, username, avatarId);
    }
    removePlayer(matchId, twitchUserId) {
        const match = this.matches.get(matchId);
        if (!match)
            return;
        match.eliminatePlayer(twitchUserId);
    }
    cleanupEmptyMatches() {
        for (const [matchId, match] of this.matches) {
            if (Object.keys(match.state.registeredPlayers).length === 0 && match.phase === "WAITING_FOR_PLAYERS") {
                this.removeMatch(matchId);
            }
        }
    }
    resetMatch(matchId) {
        const match = this.matches.get(matchId);
        if (!match)
            return;
        match.reset();
    }
}
exports.MatchManager = MatchManager;
