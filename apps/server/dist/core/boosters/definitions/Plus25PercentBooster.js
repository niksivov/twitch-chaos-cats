"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus25PercentBooster = void 0;
exports.Plus25PercentBooster = {
    id: "MULTIPLY_125",
    name: "+25%",
    description: "Increase your score by 25%",
    poolCount: 3,
    icon: "multiply_125",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score =
            Math.ceil(player.score * 1.25);
    },
};
