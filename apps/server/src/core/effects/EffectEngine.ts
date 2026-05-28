import { Match } from "../Match"

export class EffectEngine {
  process(match: Match) {
    const players =
      match.state.playerOrder.map(
        (playerId) => {
          return match.state.playersById[
            playerId
          ]
        }
      )

    for (const player of players) {
      player.activeEffects =
        player.activeEffects.filter(
          (effect) => {
            effect.remainingTurns--

            return (
              effect.remainingTurns > 0
            )
          }
        )
    }
  }
}