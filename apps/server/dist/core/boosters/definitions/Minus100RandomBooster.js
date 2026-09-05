"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minus100RandomBooster = void 0;
exports.Minus100RandomBooster = {
    id: "MINUS_100_RANDOM",
    name: "-100 случайному противнику",
    description: "Случайный противник теряет 100 очков",
    poolCount: 1,
    icon: "minus100random",
    execute: ({ match, sourcePlayerId, }) => {
        const targets = match
            .getAlivePlayers()
            .filter((player) => player.playerId !==
            sourcePlayerId);
        if (targets.length === 0) {
            return;
        }
        const randomTarget = targets[Math.floor(Math.random() *
            targets.length)];
        randomTarget.score -= 100;
    },
};
