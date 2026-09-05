"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus50Booster = void 0;
exports.Plus50Booster = {
    id: "PLUS_50",
    name: "+50",
    description: "Вы получаете 50 очков",
    poolCount: 2,
    icon: "plus50",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score += 50;
    },
};
