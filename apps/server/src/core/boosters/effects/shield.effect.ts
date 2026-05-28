import { BoosterEffect } from '../BoosterEffect'

import { Player } from '../../../models/Player'
import { Match } from '../../Match'

export class ShieldEffect
  implements BoosterEffect
{
  apply(player: Player) {
    player.activeBoosters.push('shield')

    console.log(
      `${player.nickname} received Shield`
    )
  }
}