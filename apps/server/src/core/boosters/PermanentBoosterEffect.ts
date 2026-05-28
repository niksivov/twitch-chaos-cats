import { Player } from '../../models/Player'

import { Match } from '../Match'

import { BoosterEvent } from './BoosterEvent'

export interface PermanentBoosterEffect {
  onEvent(
    event: BoosterEvent,
    player: Player,
    match: Match
  ): void
}