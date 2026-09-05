"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus40Booster = void 0;
exports.Plus40Booster = {
    id: "PLUS_40",
    name: "+40",
    description: "Вы получаете 40 очков",
    poolCount: 3,
    icon: "plus40",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score += 40;
    },
};
