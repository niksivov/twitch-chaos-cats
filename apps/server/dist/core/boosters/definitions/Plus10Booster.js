"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus10Booster = void 0;
exports.Plus10Booster = {
    id: "PLUS_10",
    name: "+10",
    description: "Вы получаете 10 очков",
    poolCount: 5,
    icon: "plus10",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score += 10;
    },
};
