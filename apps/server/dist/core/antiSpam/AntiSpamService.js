"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiSpamService = void 0;
class AntiSpamService {
    constructor() {
        this.lastCommandAtByPlayer = new Map();
        this.cooldownMs = 1500;
    }
    canExecute(playerId) {
        const now = Date.now();
        const lastCommandAt = this.lastCommandAtByPlayer.get(playerId);
        if (!lastCommandAt) {
            this.lastCommandAtByPlayer.set(playerId, now);
            return true;
        }
        const diff = now - lastCommandAt;
        if (diff < this.cooldownMs) {
            return false;
        }
        this.lastCommandAtByPlayer.set(playerId, now);
        return true;
    }
}
exports.AntiSpamService = AntiSpamService;
