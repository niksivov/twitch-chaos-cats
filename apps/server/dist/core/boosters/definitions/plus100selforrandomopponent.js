"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plus100selforrandomopponent = void 0;
exports.plus100selforrandomopponent = {
    id: "PLUS_100_SELF_OR_RANDOM_OPPONENT",
    name: "+100 Вам или противнику",
    description: "Вы получите +100 очков или случайный противник получит +100 очков - вероятность 50%/50%",
    poolCount: 1,
    icon: "plus100selforrandomopponent",
    execute: ({ match, sourcePlayerId, }) => {
        const giveToSelf = Math.random() < 0.5;
        if (giveToSelf) {
            const player = match.state.registeredPlayers[sourcePlayerId];
            if (!player) {
                return;
            }
            player.score += 100;
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
        randomOpponent.score += 100;
    },
};
