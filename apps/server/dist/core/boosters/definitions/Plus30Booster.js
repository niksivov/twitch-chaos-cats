"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus30Booster = void 0;
exports.Plus30Booster = {
    id: "PLUS_30",
    name: "+30",
    description: "Add 30 points to yourself",
    poolCount: 4,
    icon: "plus30",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score += 30;
    },
};
