"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoosterPool = void 0;
class BoosterPool {
    constructor() {
        this.boosters = [];
        this.bootstrap();
    }
    bootstrap() {
        this.boosters = [
            {
                id: 'plus_20',
                name: '+20 points',
                description: 'Get 20 points',
                type: 'instant'
            },
            {
                id: 'plus_20',
                name: '+20 points',
                description: 'Get 20 points',
                type: 'instant'
            },
            {
                id: 'plus_20',
                name: '+20 points',
                description: 'Get 20 points',
                type: 'instant'
            },
            {
                id: 'steal_15',
                name: 'Steal 15',
                description: 'Steal 15 points from leader',
                type: 'instant'
            },
            {
                id: 'steal_15',
                name: 'Steal 15',
                description: 'Steal 15 points from leader',
                type: 'instant'
            },
            {
                id: 'swap',
                name: 'Swap',
                description: 'Swap points with leader',
                type: 'instant'
            },
            {
                id: 'fast_thinker',
                name: 'Fast Thinker',
                description: 'Get points for saved seconds',
                type: 'permanent'
            },
            {
                id: 'shield',
                name: 'Shield',
                description: 'Block next negative effect',
                type: 'permanent'
            }
        ];
    }
    generateSet(size) {
        const shuffled = [...this.boosters].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(size, shuffled.length));
    }
    removeBooster(booster) {
        const index = this.boosters.findIndex(b => b.id === booster.id &&
            b.name === booster.name);
        if (index === -1) {
            return;
        }
        this.boosters.splice(index, 1);
    }
    returnBoosters(boosters) {
        this.boosters.push(...boosters);
    }
    isEmpty() {
        return this.boosters.length === 0;
    }
    getRemainingBoosters() {
        return this.boosters.length;
    }
    printPool() {
        console.log('');
        console.log(`Boosters left in pool: ${this.boosters.length}`);
        console.log('');
    }
}
exports.BoosterPool = BoosterPool;
