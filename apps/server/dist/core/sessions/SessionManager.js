"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.reconnectGraceMs = 15000;
    }
    connect(roomId, playerId) {
        this.sessions.set(playerId, {
            playerId,
            roomId,
            connected: true,
            lastSeenAt: Date.now(),
        });
    }
    disconnect(playerId) {
        const session = this.sessions.get(playerId);
        if (!session) {
            return;
        }
        session.connected = false;
        session.lastSeenAt =
            Date.now();
    }
    heartbeat(playerId) {
        const session = this.sessions.get(playerId);
        if (!session) {
            return;
        }
        session.connected = true;
        session.lastSeenAt =
            Date.now();
    }
    isConnected(playerId) {
        const session = this.sessions.get(playerId);
        if (!session) {
            return false;
        }
        if (session.connected) {
            return true;
        }
        const elapsed = Date.now() -
            session.lastSeenAt;
        return (elapsed <
            this.reconnectGraceMs);
    }
}
exports.SessionManager = SessionManager;
