"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minus20toallBooster = void 0;
exports.Minus20toallBooster = {
    id: "MINUS_20_TO_ALL",
    name: "-20 всем противникам",
    description: "All other players lose 20 points",
    poolCount: 0,
    icon: "minus20toall",
    execute: ({ match, sourcePlayerId, }) => {
        for (const player of match.getAlivePlayers()) {
            if (player.playerId ===
                sourcePlayerId) {
                continue;
            }
            player.score -= 20;
        }
    },
};
