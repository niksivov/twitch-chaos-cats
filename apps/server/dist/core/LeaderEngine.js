"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderEngine = void 0;
class LeaderEngine {
    process(match) {
        const alivePlayers = match.getAlivePlayers();
        if (alivePlayers.length === 0) {
            return;
        }
        let leader = alivePlayers[0];
        for (const player of alivePlayers) {
            if (player.score >
                leader.score) {
                leader = player;
            }
        }
        const leaderInternalId = match.getPlayerIdByTwitchId(leader.twitchUserId);
        if (!leaderInternalId)
            return;
        match.state.leaderId =
            leaderInternalId;
    }
}
exports.LeaderEngine = LeaderEngine;
