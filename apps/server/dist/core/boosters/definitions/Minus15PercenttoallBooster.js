"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minus15PercenttoallBooster = void 0;
exports.Minus15PercenttoallBooster = {
    id: "MINUS_15PERCENT_TO_ALL",
    name: "-15% всем противникам",
    description: "Все противники теряют 15% от счета",
    poolCount: 1,
    icon: "minus15percenttoall",
    execute: ({ match, sourcePlayerId, }) => {
        for (const player of match.getAlivePlayers()) {
            if (player.playerId ===
                sourcePlayerId) {
                continue;
            }
            player.score =
                Math.ceil(player.score * 0.85);
        }
    },
};
