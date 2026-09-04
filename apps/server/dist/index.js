"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTwitchBot = startTwitchBot;
exports.stopTwitchBot = stopTwitchBot;
exports.createMatchFromLobby = createMatchFromLobby;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const CommandProcessor_1 = require("./core/CommandProcessor");
const GameLoop_1 = require("./core/GameLoop");
const MatchManager_1 = require("./core/MatchManager");
const SessionManager_1 = require("./core/SessionManager");
const GameBroadcaster_1 = require("./network/GameBroadcaster");
const WebSocketServer_1 = require("./network/WebSocketServer");
const TwitchBotService_1 = require("./network/TwitchBotService");
const CommandQueue_1 = require("./core/CommandQueue");
const RegistrationLobby_1 = require("./core/RegistrationLobby");
const TurnManager_1 = require("./core/TurnManager");
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
// ======== HTTP SERVER (FIX FOR RENDER) ========
const app = (0, express_1.default)();
// ======== FIX: SERVE FRONTEND (VITE BUILD) ========
// ВАЖНО: Vite билд у тебя идёт в server/dist/client
const clientPath = path_1.default.join(__dirname, "client");
app.use(express_1.default.static(clientPath));
// SPA fallback (React Router / прямые урлы)
app.get("*", (_, res) => {
    res.sendFile(path_1.default.join(clientPath, "index.html"));
});
app.get("/health", (_, res) => {
    res.json({ ok: true });
});
const httpServer = app.listen(PORT, () => {
    console.log("HTTP server started on", PORT);
});
// ======== Создаём менеджеры ========
const sessionManager = new SessionManager_1.SessionManager();
const matchManager = new MatchManager_1.MatchManager();
const commandProcessor = new CommandProcessor_1.CommandProcessor(matchManager);
// ======== Список доступных аватаров ========
const availableAvatars = [
    "cat1", "cat2", "cat3", "cat4", "cat5", "cat6", "cat7", "cat8", "cat9",
    "cat10", "cat11", "cat12", "cat13", "cat14", "cat15", "cat16", "cat17", "cat18", "cat19", "cat20", "cat21", "cat22", "cat23", "cat24", "cat25", "cat26", "cat27",
];
// ======== Создаём лобби для регистрации игроков ========
const registrationLobby = new RegistrationLobby_1.RegistrationLobby(availableAvatars.length);
// ======== WEBSOCKET (now attached to HTTP server) ========
const websocketServer = new WebSocketServer_1.WebSocketServer(httpServer, matchManager, commandProcessor, registrationLobby);
const broadcaster = new GameBroadcaster_1.GameBroadcaster(websocketServer);
// 🔹 ВАЖНО: один общий TurnManager для всей системы
const turnManager = new TurnManager_1.TurnManager();
const gameLoop = new GameLoop_1.GameLoop(matchManager, broadcaster);
gameLoop.turnManager = turnManager;
// ======== Создаём очередь команд ========
const commandQueue = new CommandQueue_1.CommandQueue();
// ======== Канал Twitch ========
let twitchChannel = null;
// ======== Создаём Twitch-бот ========
const twitchBot = new TwitchBotService_1.TwitchBotService(registrationLobby, matchManager, gameLoop, commandProcessor, availableAvatars, websocketServer);
matchManager.setTwitchBotService(twitchBot);
// ======== Twitch start ========
function startTwitchBot(channel) {
    twitchChannel = channel;
    twitchBot.start(channel);
}
function stopTwitchBot() {
    twitchBot.stop();
    twitchChannel = null;
}
// ======== Создание матча ========
function createMatchFromLobby(input) {
    if (!twitchChannel) {
        throw new Error("Twitch channel not set. Call startTwitchBot first.");
    }
    const maxPlayersRaw = typeof input === "number" ? input : input.maxPlayers;
    const maxPlayersNum = Math.floor(Number(maxPlayersRaw));
    const maxPlayers = Math.min(20, Math.max(2, Number.isFinite(maxPlayersNum) ? maxPlayersNum : 10));
    const match = matchManager.createMatch({
        twitchChannel,
        maxPlayers,
        turnTimeSeconds: typeof input === "object" ? input.turnTimeSeconds : undefined,
        targetPoints: typeof input === "object" ? input.targetPoints : undefined,
        boosterSetSize: typeof input === "object" ? input.boosterSetSize : undefined,
    });
    match.state.registrationOpen = true;
    registrationLobby.getPlayers().forEach((p) => {
        match.addTwitchPlayer(p.twitchUserId, p.username, p.avatarId);
    });
    match.state.registrationOpen = false;
    registrationLobby.clear();
    return match;
}
// ======== Game loop ========
setInterval(() => {
    const commands = commandQueue.drain();
    for (const cmd of commands) {
        commandProcessor.enqueue({
            type: cmd.type,
            matchId: cmd.roomId,
            playerId: cmd.playerId,
            payload: cmd.payload,
            createdAt: cmd.createdAt,
        });
    }
    commandProcessor.process();
}, 100);
// ======== START ========
gameLoop.start();
console.log("server started");
console.log(`websocket running on :${PORT}`);
