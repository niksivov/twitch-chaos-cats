"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus100PercentBooster = void 0;
exports.Plus100PercentBooster = {
    id: "MULTIPLY_200",
    name: "+100%",
    description: "Increase your score by 100%",
    poolCount: 1,
    icon: "multiply_200",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score =
            Math.ceil(player.score * 2);
    },
};
