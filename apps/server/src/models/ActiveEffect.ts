export interface ActiveEffect {
  id: string

  stacks: number

  activatedAtRound: number

  durationRounds?: number

  metadata?: Record<string, unknown>
}