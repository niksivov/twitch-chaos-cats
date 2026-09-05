"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchBotService = void 0;
const tmi_js_1 = __importDefault(require("tmi.js"));
class TwitchBotService {
    constructor(room, matchManager, gameLoop, commandProcessor, availableAvatars, websocketServer, channel, onStopped) {
        this.room = room;
        this.matchManager = matchManager;
        this.gameLoop = gameLoop;
        this.commandProcessor = commandProcessor;
        this.availableAvatars = [...availableAvatars];
        this.websocketServer = websocketServer;
        this.channel = channel;
        this.onStopped = onStopped;
    }
    async start(channel) {
        this.client = new tmi_js_1.default.Client({ channels: [channel] });
        this.client.on("message", (channel, tags, message, self) => {
            if (self)
                return;
            const twitchUserId = tags["user-id"] ?? tags.username;
            const username = tags.username ?? tags["display-name"] ?? "unknown";
            if (!twitchUserId) {
                return;
            }
            this.handleMessage(twitchUserId, username, message, tags);
        });
        this.client.on("disconnected", () => {
            this.onStopped();
        });
        await this.client.connect();
    }
    createMatch(config) {
        const match = this.matchManager.createMatch({
            twitchChannel: this.channel,
            maxPlayers: config.maxPlayers,
            turnTimeSeconds: config.turnTimeSeconds,
            targetPoints: config.targetPoints,
            boosterSetSize: config.boosterSetSize,
        });
        this.room.matchId = match.id;
        for (const p of this.room.lobby.getPlayers()) {
            match.addTwitchPlayer(p.twitchUserId, p.username, p.avatarId);
        }
        this.room.lobby.clear();
        return match;
    }
    stop() {
        if (this.client) {
            this.client.disconnect();
            this.client = undefined;
        }
        this.room.matchId = null;
    }
    handleMessage(twitchUserId, username, message, tags) {
        const msg = message.trim().toLowerCase();
        // !reset — только от стримера
        if (msg === "!reset") {
            const isBroadcaster = tags?.badges?.broadcaster === "1";
            if (!isBroadcaster)
                return;
            if (this.room.matchId) {
                this.matchManager.removeMatch(this.room.matchId);
                this.room.matchId = null;
            }
            this.room.lobby.clear();
            this.websocketServer.broadcastRoomJoined(this.channel);
            return;
        }
        // !join — добавление в лобби комнаты
        if (msg === "!join") {
            if (this.room.matchId) {
                const match = this.matchManager.getMatch(this.room.matchId);
                if (!match || match.phase === "MATCH_END") {
                    if (match)
                        this.matchManager.removeMatch(this.room.matchId);
                    this.room.matchId = null;
                }
                else {
                    return;
                }
            }
            if (this.room.lobby.hasPlayer(twitchUserId)) {
                return;
            }
            const usedAvatars = this.room.lobby.getPlayers().map(p => p.avatarId);
            const remainingAvatars = this.availableAvatars.filter(a => !usedAvatars.includes(a));
            if (remainingAvatars.length === 0) {
                return;
            }
            const avatarId = remainingAvatars[Math.floor(Math.random() * remainingAvatars.length)];
            this.room.lobby.addPlayer({
                twitchUserId,
                username,
                avatarId,
            });
            setImmediate(() => {
                this.websocketServer.broadcastLobbyState(this.channel);
            });
            return;
        }
        // !N — активация бустера
        if (/^!\d+$/.test(msg)) {
            if (!this.room.matchId) {
                return;
            }
            const match = this.matchManager.getMatch(this.room.matchId);
            if (!match) {
                return;
            }
            const slot = parseInt(msg.slice(1), 10);
            const internalPlayerId = match.getPlayerIdByTwitchId(twitchUserId) ?? twitchUserId;
            this.commandProcessor.enqueue({
                type: "SELECT_BOOSTER",
                matchId: match.id,
                playerId: internalPlayerId,
                payload: { slot },
                createdAt: Date.now(),
            });
        }
    }
}
exports.TwitchBotService = TwitchBotService;
