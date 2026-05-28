import { BoosterEffect } from '../BoosterEffect'

import { Player } from '../../../models/Player'
import { Match } from '../../Match'

export class Plus20Effect
  implements BoosterEffect
{
  apply(player: Player, match: Match) {
    match.addPoints(player.id, 20)
  }
}