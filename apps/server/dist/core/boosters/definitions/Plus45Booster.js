"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus45Booster = void 0;
exports.Plus45Booster = {
    id: "PLUS_45",
    name: "+45",
    description: "Add 45 points to yourself",
    poolCount: 0,
    icon: "plus45",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score += 45;
    },
};
