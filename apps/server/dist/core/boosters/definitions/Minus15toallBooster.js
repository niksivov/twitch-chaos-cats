"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minus15toallBooster = void 0;
exports.Minus15toallBooster = {
    id: "MINUS_15_TO_ALL",
    name: "-15 всем противникам",
    description: "Все противники теряют 15 очков",
    poolCount: 1,
    icon: "minus15toall",
    execute: ({ match, sourcePlayerId, }) => {
        for (const player of match.getAlivePlayers()) {
            if (player.playerId ===
                sourcePlayerId) {
                continue;
            }
            player.score -= 15;
        }
    },
};
