// src/types/MatchTypes.ts
export interface MatchPlayer {
  twitchUserId: string
  username: string
  score: number
  isAlive?: boolean // можно для UI
}