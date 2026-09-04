"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamerSession = void 0;
const crypto_1 = require("crypto");
const HEARTBEAT_TIMEOUT_MS = 15000;
class StreamerSession {
    constructor() {
        this.sessions = new Map();
    }
    connect(channel) {
        const now = Date.now();
        const existing = this.sessions.get(channel);
        if (existing) {
            existing.connected = true;
            existing.connectedAt =
                now;
            existing.disconnectedAt =
                null;
            existing.lastHeartbeatAt =
                now;
            existing.sessionId =
                (0, crypto_1.randomUUID)();
            return existing;
        }
        const session = {
            channel,
            sessionId: (0, crypto_1.randomUUID)(),
            connected: true,
            connectedAt: now,
            disconnectedAt: null,
            lastHeartbeatAt: now,
        };
        this.sessions.set(channel, session);
        return session;
    }
    heartbeat(channel, sessionId) {
        const session = this.sessions.get(channel);
        if (!session) {
            return false;
        }
        const valid = session.connected &&
            session.sessionId ===
                sessionId;
        if (!valid) {
            return false;
        }
        session.lastHeartbeatAt =
            Date.now();
        return true;
    }
    disconnect(channel) {
        const session = this.sessions.get(channel);
        if (!session) {
            return;
        }
        session.connected = false;
        session.disconnectedAt =
            Date.now();
    }
    getSession(channel) {
        return (this.sessions.get(channel) ?? null);
    }
    validateSession(channel, sessionId) {
        const session = this.sessions.get(channel);
        if (!session) {
            return false;
        }
        const alive = Date.now() -
            session.lastHeartbeatAt <
            HEARTBEAT_TIMEOUT_MS;
        if (!alive) {
            session.connected =
                false;
            session.disconnectedAt =
                Date.now();
            return false;
        }
        return (session.connected &&
            session.sessionId ===
                sessionId);
    }
    invalidate(channel) {
        const session = this.sessions.get(channel);
        if (!session) {
            return;
        }
        session.sessionId =
            (0, crypto_1.randomUUID)();
        session.connected = false;
        session.disconnectedAt =
            Date.now();
    }
    remove(channel) {
        this.sessions.delete(channel);
    }
}
exports.StreamerSession = StreamerSession;
