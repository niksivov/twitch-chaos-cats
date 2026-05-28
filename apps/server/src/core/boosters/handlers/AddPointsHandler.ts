import { BoosterHandler } from './BoosterHandler'

import { Player } from '../../../models/Player'
import { Match } from '../../Match'

export class AddPointsHandler
  implements BoosterHandler
{
  constructor(
    private amount: number
  ) {}

  execute(
    player: Player,
    match: Match
  ) {
    match.addPoints(
      player.id,
      this.amount
    )
  }
}