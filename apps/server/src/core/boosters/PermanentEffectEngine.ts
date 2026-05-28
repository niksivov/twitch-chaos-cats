import { Player } from '../../models/Player'

import { Match } from '../Match'

import { BoosterEvent } from './BoosterEvent'

import { EffectRegistry } from './effects/EffectRegistry'

export class PermanentEffectEngine {
  private registry =
    new EffectRegistry()

  emit(
    event: BoosterEvent,
    player: Player,
    match: Match
  ) {
    player.activeEffects.forEach(
      effect => {
        const handler =
          this.registry.get(effect.id)

        if (!handler) {
          return
        }

        handler.onEvent(
          event,
          effect,
          player,
          match
        )
      }
    )
  }
}