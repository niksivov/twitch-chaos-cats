import { EffectHandler } from './EffectHandler'

import { BoosterEvent } from '../BoosterEvent'

import { ActiveEffect } from '../../../models/ActiveEffect'
import { Player } from '../../../models/Player'

import { Match } from '../../Match'

export class FastThinkerEffect
  implements EffectHandler
{
  onEvent(
    event: BoosterEvent,
    effect: ActiveEffect,
    player: Player,
    match: Match
  ) {
    if (
      event !== BoosterEvent.ROUND_START
    ) {
      return
    }

    const bonus =
      player.savedSeconds *
      effect.stacks

    if (bonus <= 0) {
      return
    }

    match.addPoints(player.id, bonus)

    console.log(
      `${player.nickname} received ${bonus} bonus points from Fast Thinker`
    )
  }
}