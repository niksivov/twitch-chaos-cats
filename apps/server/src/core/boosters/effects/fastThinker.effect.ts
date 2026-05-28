import { BoosterEffect } from '../BoosterEffect'

import { Player } from '../../../models/Player'
import { Match } from '../../Match'

export class FastThinkerEffect
  implements BoosterEffect
{
  apply(player: Player) {
    player.activeBoosters.push(
      'fast_thinker'
    )

    console.log(
      `${player.nickname} received permanent booster Fast Thinker`
    )
  }
}