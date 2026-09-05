"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapscore = void 0;
exports.swapscore = {
    id: "SWAP_SCORE_RANDOM_OPPONENT",
    name: "Обмен очками",
    description: "Вы меняетесь очками со случайным противником",
    poolCount: 3,
    icon: "swapscore",
    execute: ({ match, sourcePlayerId, }) => {
        const sourcePlayer = match.state.registeredPlayers[sourcePlayerId];
        if (!sourcePlayer) {
            return;
        }
        const opponents = match
            .getAlivePlayers()
            .filter((player) => player.playerId !==
            sourcePlayerId);
        if (opponents.length === 0) {
            return;
        }
        const randomOpponent = opponents[Math.floor(Math.random() *
            opponents.length)];
        const sourceScore = sourcePlayer.score;
        sourcePlayer.score =
            randomOpponent.score;
        randomOpponent.score =
            sourceScore;
    },
};
