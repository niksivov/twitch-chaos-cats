"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoosterSetManager = void 0;
const BoosterRegistry_1 = require("./BoosterRegistry");
class BoosterSetManager {
    constructor() {
        this.boosterRegistry = new BoosterRegistry_1.BoosterRegistry();
    }
    initialize(match) {
        if (match.state.boosterPool.length === 0) {
            this.fillBoosterPool(match);
        }
        match.state.boosterSet = [];
        const setSize = match.state
            .boosterSetSize ?? 3;
        for (let i = 1; i <= setSize; i++) {
            this.replaceSlot(match, i);
        }
        console.log("[BOOSTERSET INIT]", match.round, match.state.boosterSet);
    }
    fillBoosterPool(match) {
        const boosters = this.boosterRegistry.getAll();
        const pool = [];
        for (const booster of boosters) {
            const copies = booster.poolCount;
            for (let i = 0; i < copies; i++) {
                pool.push(booster.id);
            }
        }
        this.shuffle(pool);
        match.state.boosterPool =
            pool;
    }
    replaceSlot(match, slot) {
        if (match.state.boosterPool
            .length === 0) {
            const exhaustiblePool = match.state
                .exhaustiblePool ??
                true;
            if (!exhaustiblePool) {
                return;
            }
            this.fillBoosterPool(match);
        }
        const boosterId = match.state.boosterPool.shift();
        if (!boosterId) {
            return;
        }
        const booster = this.boosterRegistry.getById(boosterId);
        if (!booster) {
            return;
        }
        const existingIndex = match.state.boosterSet.findIndex((item) => item.slot === slot);
        const setItem = {
            slot,
            boosterId,
            boosterName: booster.name,
            boosterIcon: booster.icon,
        };
        if (existingIndex === -1) {
            match.state.boosterSet.push(setItem);
        }
        else {
            match.state.boosterSet[existingIndex] = setItem;
        }
    }
    removeSlot(match, slot) {
        match.state.boosterSet =
            match.state.boosterSet.filter((item) => item.slot !== slot);
    }
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() *
                (i + 1));
            [
                array[i],
                array[j],
            ] = [
                array[j],
                array[i],
            ];
        }
    }
}
exports.BoosterSetManager = BoosterSetManager;
