"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameBroadcaster = void 0;
class GameBroadcaster {
    constructor(websocketServer) {
        this.websocketServer = websocketServer;
    }
    broadcastMatchState(match) {
        this.websocketServer.broadcast({
            type: "match_state",
            roomId: match.state.twitchChannel,
            payload: match.toJSON(),
        });
    }
    broadcast(event) {
        this.websocketServer.broadcast(event);
    }
}
exports.GameBroadcaster = GameBroadcaster;
