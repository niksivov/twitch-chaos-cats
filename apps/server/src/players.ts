export interface Player {
  id: string

  nickname: string

  points: number

  activeBoosters: string[]

  joinedAt: number

  blocked: boolean

  savedSeconds: number

  skippedTurns: number
}