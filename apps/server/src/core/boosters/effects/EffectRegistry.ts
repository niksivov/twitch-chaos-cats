import { EffectHandler } from './EffectHandler'

import { FastThinkerEffect } from './FastThinkerEffect'

export class EffectRegistry {
  private effects: Record<
    string,
    EffectHandler
  > = {
    fast_thinker:
      new FastThinkerEffect()
  }

  get(effectId: string) {
    return this.effects[effectId]
  }
}