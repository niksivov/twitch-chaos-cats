"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus10Booster = void 0;
exports.Plus10Booster = {
    id: "PLUS_10",
    name: "+10",
    description: "Add 10 points to yourself",
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
