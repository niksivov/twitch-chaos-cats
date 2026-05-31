export interface BoosterContext {
  match: any

  sourcePlayerId: string
}

export interface BoosterDefinition {
  id: string

  name: string

  description: string

  poolCount: number

  icon: string

  execute(
    context: BoosterContext
  ): void
}