"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus25Booster = void 0;
exports.Plus25Booster = {
    id: "PLUS_25",
    name: "+25",
    description: "Add 25 points to yourself",
    poolCount: 0,
    icon: "plus25",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score += 25;
    },
};
