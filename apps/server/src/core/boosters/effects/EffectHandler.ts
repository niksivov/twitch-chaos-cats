import { ActiveEffect } from '../../../models/ActiveEffect'
import { Player } from '../../../models/Player'
import { Match } from '../../Match'

import { BoosterEvent } from '../BoosterEvent'

export interface EffectHandler {
  onEvent(
    event: BoosterEvent,
    effect: ActiveEffect,
    player: Player,
    match: Match
  ): void
}