import type { Match } from "../Match"

export interface BoosterContext {
  match: Match
  sourcePlayerId: string
}

export interface BoosterDefinition {
  id: string
  name: string
  description: string
  nameEn: string
  descriptionEn: string
  poolCount: number
  icon: string

  execute(context: BoosterContext): void
}