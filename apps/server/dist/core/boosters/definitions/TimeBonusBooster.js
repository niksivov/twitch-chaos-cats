"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeBonusBooster = void 0;
exports.TimeBonusBooster = {
    id: "TIME_BONUS_BOOSTER",
    name: "+1 за каждые 10 секунд матча",
    description: "Вы получаете +1 очко за каждые 10 секунд, что идет эта игра",
    poolCount: 2,
    icon: "timebonus",
    execute: ({ match, sourcePlayerId, }) => {
        const player = match.state.registeredPlayers[sourcePlayerId];
        if (!player) {
            return;
        }
        player.score += Math.ceil((match.state.tick ?? 0) / 10);
    },
};
