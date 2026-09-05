"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minus25PercentRandomBooster = void 0;
exports.Minus25PercentRandomBooster = {
    id: "MINUS_25_PERCENT_RANDOM",
    name: "-25% случайному противнику",
    description: "Случайный противник теряет 25% очков",
    poolCount: 1,
    icon: "minus25percentrandom",
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
                0.75);
    },
};
