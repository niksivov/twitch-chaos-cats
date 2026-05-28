import { ActiveEffect } from './ActiveEffect'

export interface Player {
  id: string

  nickname: string

  points: number

  activeEffects: ActiveEffect[]

  joinedAt: number

  blocked: boolean

  savedSeconds: number

  skippedTurns: number
}