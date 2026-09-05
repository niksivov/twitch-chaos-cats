"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchStateMachine = void 0;
const matchPhase_1 = require("./matchPhase");
const transitions = {
    [matchPhase_1.MatchPhase.WAITING_FOR_PLAYERS]: [
        matchPhase_1.MatchPhase.ROUND_START,
    ],
    [matchPhase_1.MatchPhase.ROUND_START]: [
        matchPhase_1.MatchPhase.TURN_START,
        matchPhase_1.MatchPhase.MATCH_END, // досрочная победа (напр. пандора)
    ],
    [matchPhase_1.MatchPhase.TURN_START]: [
        matchPhase_1.MatchPhase.BOOSTER_SELECTION,
        matchPhase_1.MatchPhase.MATCH_END, // досрочная победа (напр. пандора)
    ],
    [matchPhase_1.MatchPhase.BOOSTER_SELECTION]: [
        matchPhase_1.MatchPhase.BOOSTER_RESOLUTION,
        matchPhase_1.MatchPhase.MATCH_END, // досрочная победа (напр. пандора)
    ],
    [matchPhase_1.MatchPhase.BOOSTER_RESOLUTION]: [
        matchPhase_1.MatchPhase.TURN_END,
        matchPhase_1.MatchPhase.MATCH_END, // досрочная победа (напр. пандора)
    ],
    [matchPhase_1.MatchPhase.TURN_END]: [
        matchPhase_1.MatchPhase.TURN_START,
        matchPhase_1.MatchPhase.ROUND_END,
        matchPhase_1.MatchPhase.MATCH_END, // мгновенная победа по очкам или выбыванию
    ],
    [matchPhase_1.MatchPhase.ROUND_END]: [
        matchPhase_1.MatchPhase.ROUND_START,
        matchPhase_1.MatchPhase.MATCH_END,
    ],
    [matchPhase_1.MatchPhase.MATCH_END]: [
        matchPhase_1.MatchPhase.RESETTING,
    ],
    [matchPhase_1.MatchPhase.RESETTING]: [
        matchPhase_1.MatchPhase.WAITING_FOR_PLAYERS,
    ],
};
class MatchStateMachine {
    constructor(initialPhase) {
        this.phase = initialPhase;
    }
    getPhase() {
        return this.phase;
    }
    canTransition(next) {
        return transitions[this.phase].includes(next);
    }
    transition(next) {
        if (!this.canTransition(next)) {
            throw new Error(`Invalid transition: ${this.phase} -> ${next}`);
        }
        this.phase = next;
    }
}
exports.MatchStateMachine = MatchStateMachine;
