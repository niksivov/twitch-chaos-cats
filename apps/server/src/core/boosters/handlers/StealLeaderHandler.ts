import { BoosterHandler } from './BoosterHandler'

import { Player } from '../../../models/Player'
import { Match } from '../../Match'

export class StealLeaderHandler
  implements BoosterHandler
{
  constructor(
    private amount: number
  ) {}

  execute(
    player: Player,
    match: Match
  ) {
    match.stealFromLeader(
      player.id,
      this.amount
    )
  }
}