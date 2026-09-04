"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarManager = void 0;
const avatarPool_1 = require("./avatarPool");
class AvatarManager {
    constructor() {
        this.usedAvatars = new Set();
    }
    assignAvatar() {
        const available = avatarPool_1.avatarPool.filter(avatar => !this.usedAvatars.has(avatar));
        let selected;
        if (available.length > 0) {
            selected =
                available[Math.floor(Math.random() *
                    available.length)];
        }
        else {
            selected =
                avatarPool_1.avatarPool[Math.floor(Math.random() *
                    avatarPool_1.avatarPool.length)];
        }
        this.usedAvatars.add(selected);
        return selected;
    }
    releaseAvatar(avatarId) {
        this.usedAvatars.delete(avatarId);
    }
}
exports.AvatarManager = AvatarManager;
