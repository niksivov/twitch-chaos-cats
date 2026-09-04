"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchEventStore = void 0;
class MatchEventStore {
    attach(match, event) {
        match.state.recentEvents.unshift({
            id: event.id,
            text: event.text,
            createdAt: event.createdAt,
        });
        match.state.recentEvents =
            match.state.recentEvents.slice(0, 10);
    }
}
exports.MatchEventStore = MatchEventStore;
