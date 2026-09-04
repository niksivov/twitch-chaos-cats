"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchBotService = void 0;
const tmi_js_1 = __importDefault(require("tmi.js"));
const parseChatCommand_1 = require("./parseChatCommand");
class TwitchBotService {
    constructor(channel, commandQueue) {
        this.channel = channel;
        this.commandQueue = commandQueue;
        this.client = new tmi_js_1.default.Client({
            channels: [channel],
        });
    }
    async start() {
        await this.client.connect();
        console.log(`[TWITCH] Connected to ${this.channel}`);
        this.client.on("message", (channel, tags, message, self) => {
            if (self) {
                return;
            }
            const parsed = (0, parseChatCommand_1.parseChatCommand)(message);
            if (!parsed) {
                return;
            }
            const username = tags.username;
            if (!username) {
                return;
            }
            this.commandQueue.enqueue({
                id: crypto.randomUUID(),
                roomId: this.channel,
                playerId: username,
                type: parsed.type,
                payload: parsed.payload,
                createdAt: Date.now(),
            });
        });
    }
}
exports.TwitchBotService = TwitchBotService;
