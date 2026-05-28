import { Player } from '../../../models/Player'
import { Match } from '../../Match'

export interface BoosterHandler {
  execute(
    player: Player,
    match: Match
  ): void
}