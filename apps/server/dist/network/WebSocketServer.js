"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const ws_1 = require("ws");
const definitions_1 = require("../core/boosters/definitions");
const index_1 = require("../index");
const pandoraBox_1 = require("../core/boosters/definitions/pandoraBox");
class WebSocketServer {
    constructor(server, matchManager, commandProcessor, _rooms, _getOrCreateRoom) {
        this.clients = new Map();
        this.wss = new ws_1.WebSocketServer({ server });
        this.matchManager = matchManager;
        this.commandProcessor = commandProcessor;
        this.initialize();
    }
    initialize() {
        this.wss.on("connection", (socket) => {
            this.clients.set(socket, null);
            socket.on("close", () => {
                this.clients.delete(socket);
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
            case "JOIN_ROOM":
                this.handleJoinRoom(socket, message);
                break;
            case "CREATE_MATCH":
                this.handleCreateMatch(socket, message);
                break;
            case "SELECT_BOOSTER":
                this.handleSelectBooster(socket, message);
                break;
            case "GET_LOBBY":
                this.handleGetLobby(socket);
                break;
            case "START_TWITCH_BOT":
                this.handleStartTwitchBot(message);
                break;
            case "GET_BOOSTER_LIST":
                this.sendBoosterList(socket);
                break;
            case "PANDORA_DONE":
                this.handlePandoraDone(socket);
                break;
        }
    }
    handleJoinRoom(socket, message) {
        const channel = message.payload?.channel;
        if (!channel)
            return;
        this.clients.set(socket, channel);
        if (!index_1.rooms.has(channel)) {
            (0, index_1.startTwitchBot)(channel);
        }
        socket.send(JSON.stringify(this.buildRoomJoinedPayload(channel)));
    }
    buildRoomJoinedPayload(channel) {
        const room = index_1.rooms.get(channel);
        if (!room)
            return { type: "room_joined", payload: { channel, hasMatch: false, phase: "WAITING_FOR_PLAYERS", lobbyPlayers: [], turnTimeSeconds: undefined, targetPoints: undefined } };
        let hasMatch = !!room.matchId;
        let match = hasMatch ? this.matchManager.getMatch(room.matchId) : null;
        if (match && match.phase === "MATCH_END") {
            this.matchManager.removeMatch(room.matchId);
            room.matchId = null;
            hasMatch = false;
            match = null;
        }
        const phase = match?.phase ?? "WAITING_FOR_PLAYERS";
        const lobbyPlayers = room.lobby.getPlayers();
        return {
            type: "room_joined",
            payload: {
                channel,
                hasMatch,
                phase,
                lobbyPlayers,
                turnTimeSeconds: match?.state?.turnTimeSeconds,
                targetPoints: match?.state?.targetPoints,
            },
        };
    }
    buildLobbyStatePayload(channel) {
        const room = index_1.rooms.get(channel);
        const players = room ? room.lobby.getPlayers() : [];
        return { type: "lobby_state", payload: { players } };
    }
    handleCreateMatch(socket, message) {
        const roomId = this.clients.get(socket);
        if (!roomId)
            return;
        const payload = message.payload ?? {};
        const match = (0, index_1.createMatchFromLobby)(roomId, payload);
        socket.send(JSON.stringify({
            type: "MATCH_CREATED",
            data: { matchId: match.id },
        }));
    }
    handleSelectBooster(socket, message) {
        const roomId = this.clients.get(socket);
        if (!roomId)
            return;
        const room = index_1.rooms.get(roomId);
        if (!room?.matchId)
            return;
        const playerId = message.data?.playerId;
        if (!playerId)
            return;
        this.commandProcessor.enqueue({
            type: "SELECT_BOOSTER",
            matchId: room.matchId,
            playerId,
            payload: message.data,
            createdAt: Date.now(),
        });
    }
    handleStartTwitchBot(message) {
        const channel = message.payload?.channel;
        if (!channel)
            return;
        (0, index_1.startTwitchBot)(channel);
    }
    handleGetLobby(socket) {
        const roomId = this.clients.get(socket);
        if (!roomId)
            return;
        this.sendLobbyState(socket, roomId);
    }
    handlePandoraDone(socket) {
        const roomId = this.clients.get(socket);
        if (!roomId)
            return;
        const room = index_1.rooms.get(roomId);
        if (!room?.matchId)
            return;
        const match = this.matchManager.getMatch(room.matchId);
        if (!match)
            return;
        const pending = match.state.pendingPandoraRoll;
        if (!pending)
            return;
        match.state.pendingPandoraRoll = null;
        (0, pandoraBox_1.applyPandoraEffect)(match, pending.roll, pending.sourcePlayerId);
    }
    sendLobbyState(socket, channel) {
        const payload = this.buildLobbyStatePayload(channel);
        if (socket.readyState === ws_1.WebSocket.OPEN) {
            socket.send(JSON.stringify(payload));
        }
    }
    broadcastLobbyState(channel) {
        const payload = this.buildLobbyStatePayload(channel);
        const serialized = JSON.stringify(payload);
        for (const [client, clientRoom] of this.clients) {
            if (clientRoom === channel && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(serialized);
            }
        }
    }
    broadcastRoomJoined(channel) {
        const payload = this.buildRoomJoinedPayload(channel);
        const serialized = JSON.stringify(payload);
        for (const [client, clientRoom] of this.clients) {
            if (clientRoom === channel && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(serialized);
            }
        }
    }
    sendBoosterList(socket) {
        const payload = {
            type: "booster_list",
            payload: definitions_1.ALL_BOOSTERS.map((b) => ({
                id: b.id,
                name: b.name,
                description: b.description,
                icon: b.icon,
                poolCount: b.poolCount,
            })),
        };
        if (socket.readyState === ws_1.WebSocket.OPEN) {
            socket.send(JSON.stringify(payload));
        }
    }
    broadcast(data) {
        const roomId = data?.roomId;
        const serialized = JSON.stringify(data);
        if (roomId) {
            for (const [client, clientRoom] of this.clients) {
                if (clientRoom === roomId && client.readyState === ws_1.WebSocket.OPEN) {
                    client.send(serialized);
                }
            }
        }
        else {
            for (const client of this.clients.keys()) {
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    client.send(serialized);
                }
            }
        }
    }
    sendToRoom(channel, data) {
        const serialized = JSON.stringify(data);
        for (const [client, clientRoom] of this.clients) {
            if (clientRoom === channel && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(serialized);
            }
        }
    }
}
exports.WebSocketServer = WebSocketServer;
