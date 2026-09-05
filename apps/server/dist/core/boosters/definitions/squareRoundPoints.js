"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.squareRoundPoints = void 0;
exports.squareRoundPoints = {
    id: "SQUARE_ROUND_POINTS",
    name: "+ очки = квадрат раунда",
    description: "Вы получаете количество очков равное квадрату текущего раунда",
    poolCount: 1,
    icon: "squareRoundPoints",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score +=
            (match.round ?? 0) * (match.round ?? 0);
    },
};
