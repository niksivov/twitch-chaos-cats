export interface Player {
  playerId: string
  score: number
}

export interface BoosterMatch {
  state: {
    registeredPlayers: Record<string, Player>
  }

  getAlivePlayers(): Player[]
}

export interface BoosterContext {
  match: BoosterMatch
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