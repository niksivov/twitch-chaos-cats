import { Player } from '../../../models/Player'
import { Match } from '../../Match'

export interface BoosterEffect {
  apply(
    player: Player,
    match: Match
  ): void
}