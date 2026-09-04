"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoosterEngine = void 0;
const BoosterRegistry_1 = require("./BoosterRegistry");
const BoosterSetManager_1 = require("./BoosterSetManager");
const EventLog_1 = require("../events/EventLog");
const EffectEngine_1 = require("../effects/EffectEngine");
class BoosterEngine {
    constructor() {
        this.boosterRegistry = new BoosterRegistry_1.BoosterRegistry();
        this.boosterSetManager = new BoosterSetManager_1.BoosterSetManager();
        this.eventLog = new EventLog_1.EventLog();
        this.effectEngine = new EffectEngine_1.EffectEngine();
    }
    initialize(match) {
        // Инициализация набора бустеров по настройкам матча
        this.boosterSetManager.initialize(match);
    }
    activateBooster(match, playerId, slot) {
        console.log("[ACTIVATE]", {
            playerId,
            slot,
            boosterSet: match.state.boosterSet.map(b => ({
                slot: b.slot,
                boosterId: b.boosterId,
            }))
        });
        const setItem = match.state.boosterSet.find(item => item.slot === slot);
        if (!setItem)
            return;
        const booster = this.boosterRegistry.getById(setItem.boosterId);
        if (!booster)
            return;
        const player = match.state.registeredPlayers[playerId];
        if (!player)
            return;
        // Выполнение эффекта бустера
        booster.execute({
            match,
            sourcePlayerId: playerId,
        });
        this.applyEffects(match, playerId);
        // 🔹 ДОБАВЛЕН ЛОГ АКТИВАЦИИ БУСТЕРА
        this.eventLog.add(match, `⚡ ${player.username} активирует ${booster.name}`);
        // Удаляем слот из набора
        this.boosterSetManager.removeSlot(match, slot);
        // Обновляем текущий выбранный бустер
        match.state.selectedBooster = {
            boosterId: booster.id,
            sourcePlayerId: playerId,
            slot,
            activatedAt: Date.now(),
        };
    }
    applyEffects(match, playerId) {
        const effects = this.effectEngine.getPlayerEffects(match, playerId);
        for (const effect of effects) {
            switch (effect.type) {
                case "DOUBLE_POINTS":
                    this.applyDoublePoints(match, playerId);
                    break;
                // можно добавить новые типы эффектов
            }
        }
    }
    applyDoublePoints(match, playerId) {
        const player = match.state.registeredPlayers[playerId];
        if (!player)
            return;
        player.score *= 2;
    }
}
exports.BoosterEngine = BoosterEngine;
