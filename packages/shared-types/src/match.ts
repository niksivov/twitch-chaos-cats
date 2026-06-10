export type MatchPhase =
  | "LOBBY"
  | "PREPARATION"
  | "MAIN_LOOP"
  | "ENDGAME"
  | "FINISHED"

export interface PlayerSnapshot {
  twitchUserId: string

  nickname: string

  avatarId: string

  points: number

  eliminated: boolean
}

export interface MatchEventSnapshot {
  id: string

  text: string
}

export interface BoosterSnapshot {
  slot: number

  boosterId: string

  boosterName: string
}