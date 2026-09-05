"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minus50PercentRandomBooster = void 0;
exports.Minus50PercentRandomBooster = {
    id: "MINUS_50_PERCENT_RANDOM",
    name: "-50% случайному противнику",
    description: "Случайный противник теряет 50% очков",
    poolCount: 1,
    icon: "minus50percentrandom",
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
        randomTarget.score =
            Math.ceil(randomTarget.score *
                0.5);
    },
};
