"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minus25toallBooster = void 0;
exports.Minus25toallBooster = {
    id: "MINUS_25_TO_ALL",
    name: "-25 всем противникам",
    description: "Все противники теряют 25 очков",
    poolCount: 0,
    icon: "minus25toall",
    execute: ({ match, sourcePlayerId, }) => {
        for (const player of match.getAlivePlayers()) {
            if (player.playerId ===
                sourcePlayerId) {
                continue;
            }
            player.score -= 25;
        }
    },
};
