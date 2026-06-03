import { create } from "zustand"

type MatchPhase =
  | "LOBBY"
  | "STARTING"
  | "IN_PROGRESS"
  | "FINISHED"
  | "MATCH_END"

interface PlayerSnapshot {
  id: string

  nickname: string

  avatarId: string

  points: number

  eliminated: boolean
}

interface MatchEventSnapshot {
  id: string

  message: string
}

interface BoosterSnapshot {
  slot: number

  boosterName: string

  boosterIcon: string
}

interface StateUpdatePayload {
  roomId: string

  phase: MatchPhase

  tick: number

  round?: number

  currentTurnPlayerId?: string

  currentTurnStartedAt?: number

  leaderPlayerId?: string

  players: PlayerSnapshot[]

  recentEvents: MatchEventSnapshot[]

  boosterSet: BoosterSnapshot[]
}

interface GameState {
  connected: boolean

  roomId: string

  phase: MatchPhase

  tick: number

  round: number

  currentTurnPlayerId?: string

  currentTurnStartedAt?: number

  leaderPlayerId?: string

  players: PlayerSnapshot[]

  recentEvents: MatchEventSnapshot[]

  boosterSet: BoosterSnapshot[]

  turnTimerSeconds: number

  targetPoints: number

  boosterSetSize: number

  // =========================
  // Для MatchResultScreen
  // =========================

  matchFinished: boolean

  matchWinnerId?: string

  matchPlayers: PlayerSnapshot[]

  matchWinReason?: string

  setConnected: (
    connected: boolean
  ) => void

  setTurnTimerSeconds: (
    value: number
  ) => void

  setTargetPoints: (
    value: number
  ) => void

  setBoosterSetSize: (
    value: number
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

    round: 0,

    currentTurnPlayerId:
      undefined,

    currentTurnStartedAt:
      undefined,

    leaderPlayerId:
      undefined,

    players: [],

    recentEvents: [],

    boosterSet: [],

    turnTimerSeconds: 15,

    targetPoints: 100,

    boosterSetSize: 3,

    // =========================
    // MatchResultScreen state
    // =========================

    matchFinished: false,

    matchWinnerId: undefined,

    matchPlayers: [],

    matchWinReason: undefined,

    setConnected: (
      connected
    ) =>
      set({
        connected,
      }),

    setTurnTimerSeconds: (
      value
    ) =>
      set({
        turnTimerSeconds:
          value,
      }),

    setTargetPoints: (
      value
    ) =>
      set({
        targetPoints:
          value,
      }),

    setBoosterSetSize: (
      value
    ) =>
      set({
        boosterSetSize:
          value,
      }),

    applySnapshot: (
      snapshot
    ) =>
      set({
        roomId:
          snapshot.roomId,

        phase:
          snapshot.phase,

        tick:
          snapshot.tick,

        round:
          snapshot.round ?? 0,

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