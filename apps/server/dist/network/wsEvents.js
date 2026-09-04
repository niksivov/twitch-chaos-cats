"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WS_EVENTS = void 0;
exports.isWsMessage = isWsMessage;
exports.WS_EVENTS = {
    PING: "ping",
    HEARTBEAT: "heartbeat",
    HEARTBEAT_ACK: "heartbeat_ack",
    MATCH_STATE: "match_state",
    STREAMER_SESSION: "streamer_session",
    CREATE_MATCH: "create_match",
};
function isWsMessage(value) {
    if (typeof value !==
        "object" ||
        value === null) {
        return false;
    }
    const message = value;
    return (typeof message.type ===
        "string");
}
