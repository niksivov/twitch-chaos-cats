"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus15Booster = void 0;
exports.Plus15Booster = {
    id: "PLUS_15",
    name: "+15",
    description: "Вы получаете 15 очков",
    poolCount: 0,
    icon: "plus15",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score += 15;
    },
};
