"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus35Booster = void 0;
exports.Plus35Booster = {
    id: "PLUS_35",
    name: "+35",
    description: "Add 35 points to yourself",
    poolCount: 0,
    icon: "plus35",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score += 35;
    },
};
