"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEventEmitter = void 0;
class GameEventEmitter {
    constructor() {
        this.listeners = [];
    }
    emit(event) {
        for (const listener of this.listeners) {
            listener(event);
        }
    }
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners =
                this.listeners.filter((l) => {
                    return l !== listener;
                });
        };
    }
}
exports.GameEventEmitter = GameEventEmitter;
