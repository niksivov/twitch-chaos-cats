export interface Player {
  twitchUserId: string

  nickname: string

  points: number

  joinedAt: number

  blocked: boolean

  savedSeconds: number

  skippedTurns: number
}