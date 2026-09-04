"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchBotService = void 0;
const tmi_js_1 = __importDefault(require("tmi.js"));
class TwitchBotService {
    constructor(registrationLobby, matchManager, gameLoop, commandProcessor, availableAvatars, websocketServer) {
        this.currentMatchId = null;
        this.registrationLobby = registrationLobby;
        this.matchManager = matchManager;
        this.gameLoop = gameLoop;
        this.commandProcessor = commandProcessor;
        this.availableAvatars = [...availableAvatars];
        this.websocketServer = websocketServer;
    }
    // 🔹 Новая функция для уведомления бота о текущем матче
    setCurrentMatch(matchId) {
        this.currentMatchId = matchId;
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
            this.handleMessage(twitchUserId, username, message);
        });
        await this.client.connect();
    }
    createMatch(config) {
        const twitchChannel = this.client.getChannels()[0];
        if (!twitchChannel) {
            throw new Error("Twitch channel is not connected yet");
        }
        const match = this.matchManager.createMatch({
            twitchChannel,
            maxPlayers: config.maxPlayers,
            turnTimeSeconds: config.turnTimeSeconds,
            targetPoints: config.targetPoints,
            boosterSetSize: config.boosterSetSize,
        });
        this.currentMatchId = match.id;
        for (const p of this.registrationLobby.getPlayers()) {
            match.addTwitchPlayer(p.twitchUserId, p.username, p.avatarId);
        }
        this.registrationLobby.clear();
        return match;
    }
    stop() {
        if (this.client) {
            this.client.disconnect();
            this.client = undefined;
        }
        this.currentMatchId = null;
    }
    handleMessage(twitchUserId, username, message) {
        const msg = message.trim().toLowerCase();
        if (msg === "!join") {
            if (this.registrationLobby.hasPlayer(twitchUserId)) {
                return;
            }
            const usedAvatars = this.registrationLobby.getPlayers().map(p => p.avatarId);
            const remainingAvatars = this.availableAvatars.filter(a => !usedAvatars.includes(a));
            if (remainingAvatars.length === 0) {
                return;
            }
            const avatarId = remainingAvatars[Math.floor(Math.random() * remainingAvatars.length)];
            this.registrationLobby.addPlayer({
                twitchUserId,
                username,
                avatarId,
            });
            setImmediate(() => {
                this.websocketServer.broadcastLobbyState();
            });
            return;
        }
        if (/^!\d+$/.test(msg)) {
            if (!this.currentMatchId) {
                return;
            }
            const match = this.matchManager.getMatch(this.currentMatchId);
            if (!match) {
                return;
            }
            const slot = parseInt(msg.slice(1), 10);
            // 🔹 Убираем проверку currentPlayerId полностью
            const internalPlayerId = match.getPlayerIdByTwitchId(twitchUserId) ?? twitchUserId;
            // 🔹 Просто ставим команду в очередь
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
