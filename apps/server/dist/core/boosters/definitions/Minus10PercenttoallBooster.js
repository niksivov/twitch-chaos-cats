"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minus10PercenttoallBooster = void 0;
exports.Minus10PercenttoallBooster = {
    id: "MINUS_10PERCENT_TO_ALL",
    name: "-10% всем противникам",
    description: "All other players lose 10% points",
    poolCount: 1,
    icon: "minus10percenttoall",
    execute: ({ match, sourcePlayerId, }) => {
        for (const player of match.getAlivePlayers()) {
            if (player.playerId ===
                sourcePlayerId) {
                continue;
            }
            player.score =
                Math.ceil(player.score * 0.9);
        }
    },
};
