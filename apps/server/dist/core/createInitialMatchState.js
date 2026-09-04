"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialMatchState = createInitialMatchState;
function createInitialMatchState(roomId) {
    return {
        roomId,
        phase: "LOBBY",
        tick: 0,
        round: 1,
        paused: false,
        registeredPlayers: {},
        playerOrder: [],
        recentEvents: [],
        boosterSet: [],
        settings: {
            turnTimeSeconds: 30,
            boosterSetSize: 4,
            maxPlayers: 20,
        },
    };
}
