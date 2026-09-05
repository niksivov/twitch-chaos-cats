"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = void 0;
exports.startTwitchBot = startTwitchBot;
exports.stopTwitchBot = stopTwitchBot;
exports.createMatchFromLobby = createMatchFromLobby;
exports.getOrCreateRoom = getOrCreateRoom;
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
const TurnManager_1 = require("./core/TurnManager");
const Room_1 = require("./core/Room");
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
// ======== HTTP SERVER ========
const app = (0, express_1.default)();
const clientPath = path_1.default.join(__dirname, "client");
app.use(express_1.default.static(clientPath));
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
// ======== Комнаты (channel → Room) ========
const rooms = new Map();
exports.rooms = rooms;
function getOrCreateRoom(channel) {
    let room = rooms.get(channel);
    if (!room) {
        room = new Room_1.Room(channel, availableAvatars.length);
        rooms.set(channel, room);
    }
    return room;
}
// ======== WEBSOCKET ========
const websocketServer = new WebSocketServer_1.WebSocketServer(httpServer, matchManager, commandProcessor, rooms, getOrCreateRoom);
const broadcaster = new GameBroadcaster_1.GameBroadcaster(websocketServer);
const turnManager = new TurnManager_1.TurnManager();
const gameLoop = new GameLoop_1.GameLoop(matchManager, broadcaster);
gameLoop.turnManager = turnManager;
// ======== Очередь команд ========
const commandQueue = new CommandQueue_1.CommandQueue();
// ======== Twitch-боты (channel → TwitchBotService) ========
const twitchBots = new Map();
function startTwitchBot(channel) {
    if (twitchBots.has(channel))
        return;
    const room = getOrCreateRoom(channel);
    const bot = new TwitchBotService_1.TwitchBotService(room, matchManager, gameLoop, commandProcessor, availableAvatars, websocketServer, channel, () => {
        twitchBots.delete(channel);
        rooms.delete(channel);
        websocketServer.broadcastLobbyState(channel);
    });
    twitchBots.set(channel, bot);
    bot.start(channel);
}
function stopTwitchBot(channel) {
    const bot = twitchBots.get(channel);
    if (bot) {
        bot.stop();
        twitchBots.delete(channel);
    }
    rooms.delete(channel);
}
function createMatchFromLobby(channel, input) {
    const room = getOrCreateRoom(channel);
    const maxPlayersRaw = input.maxPlayers;
    const maxPlayersNum = Math.floor(Number(maxPlayersRaw));
    const maxPlayers = Math.min(20, Math.max(2, Number.isFinite(maxPlayersNum) ? maxPlayersNum : 10));
    const match = matchManager.createMatch({
        twitchChannel: channel,
        maxPlayers,
        turnTimeSeconds: input.turnTimeSeconds,
        targetPoints: input.targetPoints,
        boosterSetSize: input.boosterSetSize,
    });
    room.matchId = match.id;
    match.state.registrationOpen = true;
    room.lobby.getPlayers().forEach((p) => {
        match.addTwitchPlayer(p.twitchUserId, p.username, p.avatarId);
    });
    match.state.registrationOpen = false;
    room.lobby.clear();
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
