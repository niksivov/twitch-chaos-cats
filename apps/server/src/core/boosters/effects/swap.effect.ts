import { BoosterEffect } from '../BoosterEffect'

import { Player } from '../../../models/Player'
import { Match } from '../../Match'

export class SwapEffect
  implements BoosterEffect
{
  apply(player: Player, match: Match) {
    match.swapWithLeader(player.id)
  }
}