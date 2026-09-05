"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randompoints = void 0;
exports.randompoints = {
    id: "RANDOM_POINTS_0_TO_100",
    name: "0-100 очков",
    description: "Вы получите случайное количество очков от 0 до 100",
    poolCount: 1,
    icon: "randompoints",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        const points = Math.floor(Math.random() * 101);
        player.score +=
            points;
    },
};
