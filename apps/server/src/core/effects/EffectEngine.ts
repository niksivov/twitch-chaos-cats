import { Match } from "../Match"

export interface ActiveEffect {
  id: string

  type: string

  playerId: string

  startedAt: number

  expiresAt: number | null

  payload?: any
}

export class EffectEngine {
  private readonly effects =
    new Map<
      string,
      ActiveEffect[]
    >()

  process(match: Match) {
    const effects =
      this.effects.get(
        match.id
      ) ?? []

    if (effects.length === 0) {
      return
    }

    const now = Date.now()

    const activeEffects =
      effects.filter(
        (effect) => {
          if (
            effect.expiresAt ===
            null
          ) {
            return true
          }

          return (
            now <
            effect.expiresAt
          )
        }
      )

    this.effects.set(
      match.id,
      activeEffects
    )
  }

  addEffect(
    match: Match,

    effect: ActiveEffect
  ) {
    const effects =
      this.effects.get(
        match.id
      ) ?? []

    effects.push(effect)

    this.effects.set(
      match.id,
      effects
    )
  }

  removeEffect(
    match: Match,

    effectId: string
  ) {
    const effects =
      this.effects.get(
        match.id
      ) ?? []

    const filtered =
      effects.filter(
        (effect) =>
          effect.id !== effectId
      )

    this.effects.set(
      match.id,
      filtered
    )
  }

  clearMatchEffects(
    match: Match
  ) {
    this.effects.delete(
      match.id
    )
  }

  getEffects(
    match: Match
  ): ActiveEffect[] {
    return (
      this.effects.get(
        match.id
      ) ?? []
    )
  }

  getPlayerEffects(
    match: Match,

    playerId: string
  ): ActiveEffect[] {
    const effects =
      this.effects.get(
        match.id
      ) ?? []

    return effects.filter(
      (effect) =>
        effect.playerId ===
        playerId
    )
  }

  hasEffect(
    match: Match,

    playerId: string,

    effectType: string
  ): boolean {
    return this
      .getPlayerEffects(
        match,
        playerId
      )
      .some(
        (effect) =>
          effect.type ===
          effectType
      )
  }
}