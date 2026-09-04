"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlayer = createPlayer;
function createPlayer(twitchUserId, nickname, avatarId) {
    return {
        twitchUserId,
        nickname,
        avatarId,
        points: 0,
        eliminated: false,
        connected: true,
        lastCommandAt: 0,
    };
}
