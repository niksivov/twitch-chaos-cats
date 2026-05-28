import { MatchState } from "../models/MatchState"

export function createInitialMatchState(
  roomId: string
): MatchState {
  return {
    roomId,

    phase: "LOBBY",

    tick: 0,

    round: 1,

    paused: false,

    playersById: {},

    playerOrder: [],

    recentEvents: [],

    boosterSet: [],

    settings: {
      turnTimeSeconds: 15,

      boosterSetSize: 4,

      maxPlayers: 20,
    },
  }
}