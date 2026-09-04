"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoosterRegistry = void 0;
const definitions_1 = require("./definitions");
class BoosterRegistry {
    constructor() {
        this.boosters = new Map();
        for (const booster of definitions_1.ALL_BOOSTERS) {
            this.register(booster);
        }
    }
    register(booster) {
        this.boosters.set(booster.id, booster);
    }
    getAll() {
        return [
            ...this.boosters.values(),
        ];
    }
    getById(id) {
        return this.boosters.get(id);
    }
}
exports.BoosterRegistry = BoosterRegistry;
