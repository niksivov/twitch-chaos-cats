"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plus50PercentBooster = void 0;
exports.Plus50PercentBooster = {
    id: "MULTIPLY_150",
    name: "+50%",
    description: "Вы получаете +50% к счету",
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
