export interface MatchPlayer {
  twitchUserId: string

  nickname: string

  avatarId: string

  points: number

  eliminated: boolean

  connected: boolean

  lastCommandAt: number
}

export interface MatchEvent {
  id: string

  text: string

  createdAt: number
}

export interface BoosterSetItem {
  slot: number

  boosterId: string

  boosterName: string
}

export interface MatchSettings {
  turnTimeSeconds: number

  boosterSetSize: number

  maxPlayers: number
}

export interface MatchState {
  roomId: string
  playerOrder?: string[]
  phase:
    | "LOBBY"
    | "PREPARATION"
    | "MAIN_LOOP"
    | "ENDGAME"
    | "FINISHED"

  tick: number

  round: number

  paused: boolean

  registeredPlayers: Record<
    string,
    MatchPlayer
  >

  currentTurnPlayerId?: string

  currentTurnStartedAt?: number

  leaderPlayerId?: string

  recentEvents: MatchEvent[]

  boosterSet: BoosterSetItem[]

  settings: MatchSettings

  startedAt?: number

  finishedAt?: number
}