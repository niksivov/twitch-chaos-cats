import type {
  MatchPhase,
  PlayerSnapshot,
  MatchEventSnapshot,
  BoosterSnapshot,
} from "./match"

export interface ServerMessage<T = any> {
  type: string

  payload: T
}

export interface StateUpdatePayload {
  roomId: string

  phase: MatchPhase

  tick: number

  currentTurnPlayerId?: string

  currentTurnStartedAt?: number

  leaderPlayerId?: string

  players: PlayerSnapshot[]

  recentEvents: MatchEventSnapshot[]

  boosterSet: BoosterSnapshot[]
}