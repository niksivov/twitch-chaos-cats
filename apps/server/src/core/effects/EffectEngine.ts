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
  process(match: Match) {
    const effects =
      match.state.effects ?? []

    if (effects.length === 0) {
      return
    }

    const now = Date.now()

    match.state.effects =
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
  }

  addEffect(
    match: Match,

    effect: ActiveEffect
  ) {
    if (
      !match.state.effects
    ) {
      match.state.effects =
        []
    }

    match.state.effects.push(
      effect
    )
  }

  removeEffect(
    match: Match,

    effectId: string
  ) {
    if (
      !match.state.effects
    ) {
      return
    }

    match.state.effects =
      match.state.effects.filter(
        (effect) =>
          effect.id !== effectId
      )
  }

  clearMatchEffects(
    match: Match
  ) {
    match.state.effects = []
  }

  getEffects(
    match: Match
  ): ActiveEffect[] {
    return (
      match.state.effects ??
      []
    )
  }

  getPlayerEffects(
    match: Match,

    playerId: string
  ): ActiveEffect[] {
    return this.getEffects(
      match
    ).filter(
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