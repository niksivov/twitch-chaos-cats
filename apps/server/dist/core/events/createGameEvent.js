"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameEvent = createGameEvent;
function createGameEvent(type, text) {
    return {
        id: crypto.randomUUID(),
        type,
        text,
        createdAt: Date.now(),
    };
}
