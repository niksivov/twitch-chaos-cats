import { create } from "zustand"

import {
  MatchPhase,
  PlayerSnapshot,
  MatchEventSnapshot,
  BoosterSnapshot,
  StateUpdatePayload,
} from "@twitch-chaos-cats/shared-types"

interface GameState {
  connected: boolean

  roomId: string

  phase: MatchPhase

  tick: number

  currentTurnPlayerId?: string

  currentTurnStartedAt?: number

  leaderPlayerId?: string

  players: PlayerSnapshot[]

  recentEvents: MatchEventSnapshot[]

  boosterSet: BoosterSnapshot[]

  setConnected: (
    connected: boolean
  ) => void

  applySnapshot: (
    snapshot: StateUpdatePayload
  ) => void
}

export const useGameStore =
  create<GameState>((set) => ({
    connected: false,

    roomId: "",

    phase: "LOBBY",

    tick: 0,

    currentTurnPlayerId:
      undefined,

    currentTurnStartedAt:
      undefined,

    leaderPlayerId:
      undefined,

    players: [],

    recentEvents: [],

    boosterSet: [],

    setConnected: (
      connected
    ) =>
      set({
        connected,
      }),

    applySnapshot: (
      snapshot
    ) =>
      set({
        roomId:
          snapshot.roomId,

        phase:
          snapshot.phase,

        tick: snapshot.tick,

        currentTurnPlayerId:
          snapshot.currentTurnPlayerId,

        currentTurnStartedAt:
          snapshot.currentTurnStartedAt,

        leaderPlayerId:
          snapshot.leaderPlayerId,

        players:
          snapshot.players,

        recentEvents:
          snapshot.recentEvents,

        boosterSet:
          snapshot.boosterSet,
      }),
  }))
}