"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventLog = void 0;
const MAX_LOG_ENTRIES = 50;
class EventLog {
    add(match, message) {
        if (!match.state.eventLog) {
            match.state.eventLog =
                [];
        }
        const entry = {
            id: [
                Date.now(),
                Math.random(),
            ].join("_"),
            message,
            createdAt: Date.now(),
        };
        match.state.eventLog.unshift(entry);
        if (match.state.eventLog
            .length >
            MAX_LOG_ENTRIES) {
            match.state.eventLog.length =
                MAX_LOG_ENTRIES;
        }
    }
    getEntries(match) {
        return (match.state.eventLog ??
            []);
    }
    clear(match) {
        match.state.eventLog =
            [];
    }
}
exports.EventLog = EventLog;
