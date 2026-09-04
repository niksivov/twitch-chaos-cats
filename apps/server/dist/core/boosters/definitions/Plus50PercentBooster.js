"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus50PercentBooster = void 0;
exports.Plus50PercentBooster = {
    id: "MULTIPLY_150",
    name: "+50%",
    description: "Increase your score by 50%",
    poolCount: 2,
    icon: "multiply_150",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score =
            Math.ceil(player.score * 1.5);
    },
};
