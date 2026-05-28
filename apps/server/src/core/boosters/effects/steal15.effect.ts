import { BoosterEffect } from '../BoosterEffect'

import { Player } from '../../../models/Player'
import { Match } from '../../Match'

export class Steal15Effect
  implements BoosterEffect
{
  apply(player: Player, match: Match) {
    match.stealFromLeader(player.id, 15)
  }
}