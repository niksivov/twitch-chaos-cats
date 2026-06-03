// src/types/MatchTypes.ts
export interface MatchPlayer {
  id: string
  username: string
  score: number
  isAlive?: boolean // можно для UI
}