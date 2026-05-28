import { BoosterHandler } from './BoosterHandler'

import { Player } from '../../../models/Player'
import { Match } from '../../Match'

export class SwapLeaderHandler
  implements BoosterHandler
{
  execute(
    player: Player,
    match: Match
  ) {
    match.swapWithLeader(player.id)
  }
}