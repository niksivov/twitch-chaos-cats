"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minus10toallBooster = void 0;
exports.Minus10toallBooster = {
    id: "MINUS_10_TO_ALL",
    name: "-10 всем противникам",
    description: "All other players lose 10 points",
    poolCount: 1,
    icon: "minus10toall",
    execute: ({ match, sourcePlayerId, }) => {
        for (const player of match.getAlivePlayers()) {
            if (player.playerId ===
                sourcePlayerId) {
                continue;
            }
            player.score -= 10;
        }
    },
};
