"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comebackLeader = void 0;
exports.comebackLeader = {
    id: "COMEBACK_LEADER",
    name: "Если у Вас <0, станьте лидером!",
    description: "Если у Вас меньше 0 очков, то Ваш счет становится равен максимальному счету в матче + 1",
    poolCount: 1,
    icon: "comebackLeader",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        if (player.score >= 0) {
            return;
        }
        const alivePlayers = match.getAlivePlayers();
        if (alivePlayers.length === 0) {
            return;
        }
        const maxScore = Math.max(...alivePlayers.map(p => p.score));
        player.score = maxScore + 1;
    },
};
