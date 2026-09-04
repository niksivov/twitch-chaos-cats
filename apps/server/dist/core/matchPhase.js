"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchPhase = void 0;
var MatchPhase;
(function (MatchPhase) {
    MatchPhase["WAITING_FOR_PLAYERS"] = "WAITING_FOR_PLAYERS";
    MatchPhase["ROUND_START"] = "ROUND_START";
    MatchPhase["TURN_START"] = "TURN_START";
    MatchPhase["BOOSTER_SELECTION"] = "BOOSTER_SELECTION";
    MatchPhase["BOOSTER_RESOLUTION"] = "BOOSTER_RESOLUTION";
    MatchPhase["TURN_END"] = "TURN_END";
    MatchPhase["ROUND_END"] = "ROUND_END";
    MatchPhase["MATCH_END"] = "MATCH_END";
    MatchPhase["RESETTING"] = "RESETTING";
})(MatchPhase || (exports.MatchPhase = MatchPhase = {}));
