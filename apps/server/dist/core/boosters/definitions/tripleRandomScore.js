"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripleRandomScore = void 0;
exports.tripleRandomScore = {
    id: "TRIPLE_RANDOM_PLAYER_SCORE",
    name: "×3 случайному игроку",
    description: "Очки случайного игрока умножаются на 3",
    poolCount: 1,
    icon: "tripleRandomScore",
    execute: ({ match, }) => {
        const alivePlayers = match.getAlivePlayers();
        if (alivePlayers.length === 0) {
            return;
        }
        const randomPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        randomPlayer.score =
            randomPlayer.score * 3;
    },
};
