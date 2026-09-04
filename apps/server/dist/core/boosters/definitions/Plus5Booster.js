"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus5Booster = void 0;
exports.Plus5Booster = {
    id: "PLUS_5",
    name: "+5",
    description: "Add 5 points to yourself",
    poolCount: 0,
    icon: "plus5",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score += 5;
    },
};
