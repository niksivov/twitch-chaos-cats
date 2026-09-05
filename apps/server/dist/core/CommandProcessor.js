"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandProcessor = void 0;
const matchPhase_1 = require("./matchPhase");
const BoosterEngine_1 = require("./boosters/BoosterEngine");
class CommandProcessor {
    constructor(matchManager) {
        this.matchManager = matchManager;
        this.queue = [];
        this.processedKeys = new Set();
        this.cooldowns = new Map();
        this.boosterEngine = new BoosterEngine_1.BoosterEngine();
    }
    enqueue(command) {
        const key = this.buildCommandKey(command);
        if (this.processedKeys.has(key)) {
            return;
        }
        this.processedKeys.add(key);
        this.queue.push(command);
    }
    process() {
        const commands = [...this.queue];
        this.queue.length = 0;
        for (const command of commands) {
            this.processCommand(command);
        }
        this.cleanup();
    }
    processCommand(command) {
        if (!command.matchId) {
            return;
        }
        const match = this.matchManager.getMatch(command.matchId);
        if (!match) {
            return;
        }
        switch (command.type) {
            case "SELECT_BOOSTER":
                this.handleSelectBooster(match, command);
                break;
        }
    }
    handleSelectBooster(match, command) {
        if (match.phase !== matchPhase_1.MatchPhase.BOOSTER_SELECTION) {
            return;
        }
        if (match.state.turnResolvedAt !== null) {
            return;
        }
        if (!command.playerId) {
            return;
        }
        if (command.playerId !== match.currentPlayerId) {
            return;
        }
        const cooldownKey = `${command.playerId}:SELECT_BOOSTER`;
        const now = Date.now();
        const cooldown = this.cooldowns.get(cooldownKey) ?? 0;
        if (now < cooldown) {
            return;
        }
        this.cooldowns.set(cooldownKey, now + 1000);
        const slot = command.payload?.slot;
        if (typeof slot !== "number") {
            return;
        }
        if (slot === 0) {
            match.state.turnResolvedAt = now;
            match.transition(matchPhase_1.MatchPhase.BOOSTER_RESOLUTION);
            return;
        }
        const setItem = match.state.boosterSet.find((item) => item.slot === slot);
        if (!setItem) {
            return;
        }
        match.state.turnResolvedAt = now;
        this.boosterEngine.activateBooster(match, command.playerId, slot);
        match.transition(matchPhase_1.MatchPhase.BOOSTER_RESOLUTION);
    }
    buildCommandKey(command) {
        const match = command.matchId
            ? this.matchManager.getMatch(command.matchId)
            : null;
        return [
            command.type,
            command.matchId ?? "",
            command.playerId ?? "",
            match?.round ?? 0,
            JSON.stringify(command.payload),
        ].join(":");
    }
    cleanup() {
        if (this.processedKeys.size > 10000) {
            this.processedKeys.clear();
        }
    }
}
exports.CommandProcessor = CommandProcessor;
