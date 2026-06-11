import type { Match } from "../Match"

export interface BoosterContext {
  match: Match
  sourcePlayerId: string
}

export interface BoosterDefinition {
  id: string
  name: string
  description: string
  poolCount: number
  icon: string

  execute(context: BoosterContext): void
}