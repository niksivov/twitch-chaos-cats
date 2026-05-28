import { BoosterHandler } from './BoosterHandler'

import { Player } from '../../../models/Player'
import { Match } from '../../Match'

import { ActiveEffect } from '../../../models/ActiveEffect'

export class AddEffectHandler
  implements BoosterHandler
{
  constructor(
    private effectId: string
  ) {}

  execute(
    player: Player,
    match: Match
  ) {
    const existingEffect =
      player.activeEffects.find(
        effect =>
          effect.id === this.effectId
      )

    if (existingEffect) {
      existingEffect.stacks++

      console.log(
        `${player.nickname} upgraded ${this.effectId} to x${existingEffect.stacks}`
      )

      return
    }

    const newEffect: ActiveEffect = {
      id: this.effectId,

      stacks: 1,

      activatedAtRound:
        match.currentRound
    }

    player.activeEffects.push(
      newEffect
    )

    console.log(
      `${player.nickname} received permanent effect ${this.effectId}`
    )
  }
}