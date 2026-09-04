"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.halfTopScore = void 0;
exports.halfTopScore = {
    id: "HALF_TOP_SCORE",
    name: "Твой счет = 50% от лидера",
    description: "Ваш счет становится равен 50% от наибольшего счета в матче",
    poolCount: 1,
    icon: "halfTopScore",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        const alivePlayers = match.getAlivePlayers();
        if (alivePlayers.length === 0) {
            return;
        }
        const maxScore = Math.max(...alivePlayers.map(p => p.score));
        player.score = Math.ceil(maxScore * 0.5);
    },
};
