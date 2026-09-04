"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const crypto_1 = require("crypto");
class SessionManager {
    constructor() {
        this.sessions = new Map();
    }
    createSession(playerId, username, matchId, matchRuntimeId, playerRuntimeId) {
        const existing = this.sessions.get(playerId);
        if (existing) {
            existing.username =
                username;
            existing.matchId =
                matchId;
            existing.matchRuntimeId =
                matchRuntimeId;
            existing.playerRuntimeId =
                playerRuntimeId;
            existing.connected =
                true;
            existing.connectedAt =
                Date.now();
            existing.disconnectedAt =
                null;
            return existing;
        }
        const session = {
            playerId,
            username,
            matchId,
            matchRuntimeId,
            playerRuntimeId,
            connected: true,
            connectedAt: Date.now(),
            disconnectedAt: null,
        };
        this.sessions.set(playerId, session);
        return session;
    }
    getSession(playerId) {
        return (this.sessions.get(playerId) ?? null);
    }
    disconnect(playerId) {
        const session = this.sessions.get(playerId);
        if (!session) {
            return;
        }
        session.connected = false;
        session.disconnectedAt =
            Date.now();
    }
    reconnect(playerId) {
        const session = this.sessions.get(playerId);
        if (!session) {
            return null;
        }
        session.connected = true;
        session.disconnectedAt =
            null;
        return session;
    }
    removeSession(playerId) {
        this.sessions.delete(playerId);
    }
    rotatePlayerRuntime(playerId) {
        const session = this.sessions.get(playerId);
        if (!session) {
            return null;
        }
        session.playerRuntimeId =
            (0, crypto_1.randomUUID)();
        return (session.playerRuntimeId);
    }
    rotateMatchPlayerRuntimes(matchId) {
        for (const session of this
            .sessions.values()) {
            if (session.matchId ===
                matchId) {
                session.playerRuntimeId =
                    (0, crypto_1.randomUUID)();
                session.connected =
                    false;
                session.disconnectedAt =
                    Date.now();
            }
        }
    }
    updateMatchRuntime(matchId, runtimeId) {
        for (const session of this
            .sessions.values()) {
            if (session.matchId ===
                matchId) {
                session.matchRuntimeId =
                    runtimeId;
            }
        }
    }
    removeMatchSessions(matchId) {
        for (const [playerId, session,] of this.sessions) {
            if (session.matchId ===
                matchId) {
                this.sessions.delete(playerId);
            }
        }
    }
}
exports.SessionManager = SessionManager;
