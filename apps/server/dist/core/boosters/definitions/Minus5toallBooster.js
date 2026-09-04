"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minus5toallBooster = void 0;
exports.Minus5toallBooster = {
    id: "MINUS_5_TO_ALL",
    name: "-5 всем противникам",
    description: "All other players lose 5 points",
    poolCount: 0,
    icon: "minus5toall",
    execute: ({ match, sourcePlayerId, }) => {
        for (const player of match.getAlivePlayers()) {
            if (player.playerId ===
                sourcePlayerId) {
                continue;
            }
            player.score -= 5;
        }
    },
};
