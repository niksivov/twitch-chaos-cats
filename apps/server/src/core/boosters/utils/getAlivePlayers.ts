import { Match } from "../Match"

export function getAlivePlayers(
  match: Match
) {
  return match.state.playerOrder
    .map((playerId) => {
      return match.state.playersById[
        playerId
      ]
    })
    .filter((player) => {
      return !player.eliminated
    })
}