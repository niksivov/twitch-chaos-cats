"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const ws_1 = require("ws");
// ✅ Импортируем функцию из index.ts для создания матча с игроками из Lobby
const index_1 = require("../index");
class WebSocketServer {
    constructor(server, matchManager, commandProcessor, registrationLobby) {
        this.matchManager = matchManager;
        this.commandProcessor = commandProcessor;
        this.registrationLobby = registrationLobby;
        this.clients = new Set();
        this.wss = new ws_1.WebSocketServer({ server });
        this.initialize();
    }
    initialize() {
        this.wss.on("connection", (socket) => {
            console.log("websocket client connected");
            this.clients.add(socket);
            this.sendLobbyState(socket);
            socket.on("close", () => {
                this.clients.delete(socket);
                console.log("websocket client disconnected");
            });
            socket.on("message", (raw) => {
                try {
                    const message = JSON.parse(raw.toString());
                    this.handleMessage(socket, message);
                }
                catch (error) {
                    console.error("[WebSocket] invalid message", error);
                }
            });
        });
    }
    handleMessage(socket, message) {
        switch (message.type) {
            case "CREATE_MATCH":
                this.handleCreateMatch(socket, message);
                break;
            case "SELECT_BOOSTER":
                this.handleSelectBooster(socket, message);
                break;
            case "GET_LOBBY":
                this.sendLobbyState(socket);
                break;
            case "START_TWITCH_BOT":
                this.handleStartTwitchBot(message);
                break;
            case "RESET_MATCH":
                this.handleResetMatch(socket);
                break;
        }
    }
    handleCreateMatch(socket, message) {
        const payload = message.payload ?? {};
        const match = (0, index_1.createMatchFromLobby)(payload);
        socket.matchId = match.id;
        socket.send(JSON.stringify({
            type: "MATCH_CREATED",
            data: { matchId: match.id },
        }));
    }
    handleSelectBooster(socket, message) {
        const matchId = socket.matchId;
        if (!matchId)
            return;
        const playerId = message.data?.playerId;
        if (!playerId)
            return;
        this.commandProcessor.enqueue({
            type: "SELECT_BOOSTER",
            matchId,
            playerId,
            payload: message.data,
            createdAt: Date.now(),
        });
    }
    handleStartTwitchBot(message) {
        const channel = message.payload?.channel;
        if (!channel)
            return;
        console.log(`[WebSocket] START_TWITCH_BOT for channel: ${channel}`);
        (0, index_1.startTwitchBot)(channel);
        this.broadcastLobbyState();
    }
    handleResetMatch(socket) {
        const matchId = socket.matchId;
        if (matchId) {
            this.matchManager.removeMatch(matchId);
        }
        (0, index_1.stopTwitchBot)();
        this.broadcastLobbyState();
    }
    sendLobbyState(socket) {
        console.log("[WS] sendLobbyState called");
        console.log("[WS] clients count:", this.clients.size);
        const payload = {
            type: "lobby_state",
            payload: { players: [...this.registrationLobby.getPlayers()] },
        };
        const serialized = JSON.stringify(payload);
        console.log("[WS] serialized lobby_state:", serialized);
        if (socket) {
            console.log("[WS] sending to SINGLE socket");
            if (socket.readyState === ws_1.WebSocket.OPEN) {
                socket.send(serialized);
            }
            else {
                console.log("[WS] socket not OPEN:", socket.readyState);
            }
        }
        else {
            console.log("[WS] broadcasting to ALL clients");
            for (const client of this.clients) {
                console.log("[WS] client state:", client.readyState);
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    client.send(serialized);
                }
            }
        }
    }
    broadcastLobbyState() {
        this.sendLobbyState();
    }
    broadcast(data) {
        const serialized = JSON.stringify(data);
        for (const client of this.clients) {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(serialized);
            }
        }
    }
}
exports.WebSocketServer = WebSocketServer;
