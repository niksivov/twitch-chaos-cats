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
            console.log("[CommandProcessor] Command already processed, skipping:", key);
            return;
        }
        this.processedKeys.add(key);
        console.log("[CommandProcessor] Enqueued command:", command);
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
            console.log("[CommandProcessor] Missing matchId, skipping command:", command);
            return;
        }
        const match = this.matchManager.getMatch(command.matchId);
        if (!match) {
            console.log("[CommandProcessor] Match not found for id:", command.matchId);
            return;
        }
        console.log("[CommandProcessor] Processing command:", command.type, "for match:", match.id);
        switch (command.type) {
            case "SELECT_BOOSTER":
                this.handleSelectBooster(match, command);
                break;
            default:
                console.log("[CommandProcessor] Unknown command type:", command.type);
        }
    }
    handleSelectBooster(match, command) {
        console.log("[BoostCommandHandler] Current match phase:", match.phase);
        if (match.phase !== matchPhase_1.MatchPhase.BOOSTER_SELECTION) {
            console.log("[BoostCommandHandler] Not in BOOSTER_SELECTION phase, stopping.");
            return;
        }
        if (match.state.turnResolvedAt !== null) {
            console.log("[BoostCommandHandler] Turn already resolved, stopping.");
            return;
        }
        if (!command.playerId) {
            console.log("[BoostCommandHandler] Missing playerId, stopping.");
            return;
        }
        console.log("[BoostCommandHandler] Current turn player:", match.currentPlayerId);
        console.log("[BoostCommandHandler] Command playerId:", command.playerId);
        if (command.playerId !== match.currentPlayerId) {
            console.log("[BoostCommandHandler] Not player's turn, stopping.");
            return;
        }
        const cooldownKey = `${command.playerId}:SELECT_BOOSTER`;
        const now = Date.now();
        const cooldown = this.cooldowns.get(cooldownKey) ?? 0;
        console.log("[BoostCommandHandler] Cooldown check:", { now, cooldown });
        if (now < cooldown) {
            console.log("[BoostCommandHandler] Still on cooldown, stopping.");
            return;
        }
        this.cooldowns.set(cooldownKey, now + 1000);
        const slot = command.payload?.slot;
        if (typeof slot !== "number") {
            console.log("[BoostCommandHandler] Invalid slot value:", slot);
            return;
        }
        console.log("[BoostCommandHandler] Activating booster for player", command.playerId, "slot", slot);
        match.state.turnResolvedAt = now;
        this.boosterEngine.activateBooster(match, command.playerId, slot);
        match.transition(matchPhase_1.MatchPhase.BOOSTER_RESOLUTION);
        console.log("[BoostCommandHandler] Booster activated and phase transitioned to BOOSTER_RESOLUTION");
    }
    buildCommandKey(command) {
        const match = command.matchId
            ? this.matchManager.getMatch(command.matchId)
            : null;
        return [
            command.type,
            command.matchId ?? "",
            command.playerId ?? "",
            match?.round ?? 0, // 👈 ВОТ СЮДА
            JSON.stringify(command.payload),
        ].join(":");
    }
    cleanup() {
        if (this.processedKeys.size > 10000) {
            console.log("[CommandProcessor] Clearing processedKeys set to avoid memory leak");
            this.processedKeys.clear();
        }
    }
}
exports.CommandProcessor = CommandProcessor;
