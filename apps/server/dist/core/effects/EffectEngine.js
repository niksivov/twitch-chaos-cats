"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectEngine = void 0;
class EffectEngine {
    process(match) {
        const effects = match.state.effects ?? [];
        if (effects.length === 0) {
            return;
        }
        const now = Date.now();
        match.state.effects =
            effects.filter((effect) => {
                if (effect.expiresAt ===
                    null) {
                    return true;
                }
                return (now <
                    effect.expiresAt);
            });
    }
    addEffect(match, effect) {
        if (!match.state.effects) {
            match.state.effects =
                [];
        }
        match.state.effects.push(effect);
    }
    removeEffect(match, effectId) {
        if (!match.state.effects) {
            return;
        }
        match.state.effects =
            match.state.effects.filter((effect) => effect.id !== effectId);
    }
    clearMatchEffects(match) {
        match.state.effects = [];
    }
    getEffects(match) {
        return (match.state.effects ??
            []);
    }
    getPlayerEffects(match, playerId) {
        return this.getEffects(match).filter((effect) => effect.playerId ===
            playerId);
    }
    hasEffect(match, playerId, effectType) {
        return this
            .getPlayerEffects(match, playerId)
            .some((effect) => effect.type ===
            effectType);
    }
}
exports.EffectEngine = EffectEngine;
