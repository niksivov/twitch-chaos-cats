import { Player } from '../../../models/Player'

import { Match } from '../../Match'

import { BoosterEvent } from '../BoosterEvent'
import { PermanentBoosterEffect } from '../PermanentBoosterEffect'

export class FastThinkerPermanentEffect
  implements PermanentBoosterEffect
{
  onEvent(
    event: BoosterEvent,
    player: Player,
    match: Match
  ) {
    switch (event) {
      case BoosterEvent.ROUND_START:
        const bonus =
          player.savedSeconds * 2

        player.points += bonus

        console.log(
          `${player.nickname} received ${bonus} bonus points from Fast Thinker`
        )

        break
    }
  }
}