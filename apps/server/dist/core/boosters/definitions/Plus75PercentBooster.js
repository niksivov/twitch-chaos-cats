"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus75PercentBooster = void 0;
exports.Plus75PercentBooster = {
    id: "MULTIPLY_175",
    name: "+75%",
    description: "Increase your score by 75%",
    poolCount: 1,
    icon: "multiply_175",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score =
            Math.ceil(player.score * 1.75);
    },
};
