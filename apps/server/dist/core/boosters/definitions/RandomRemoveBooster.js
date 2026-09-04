"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomRemoveBooster = void 0;
exports.RandomRemoveBooster = {
    id: "RANDOM_REMOVE",
    name: "случайная смерть",
    description: "Remove random enemy from game",
    poolCount: 1,
    icon: "random_remove",
    execute: ({ match, sourcePlayerId, }) => {
        const targets = match
            .getAlivePlayers();
        if (targets.length === 0) {
            return;
        }
        const randomTarget = targets[Math.floor(Math.random() *
            targets.length)];
        randomTarget.isAlive =
            false;
    },
};
