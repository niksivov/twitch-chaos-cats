import { Match } from "./Match"

export class LeaderEngine {
  process(match: Match) {
    const state = match.state

    const players =
      state.playerOrder
        .map((playerId) => {
          return state.playersById[playerId]
        })
        .filter((player) => {
          return !player.eliminated
        })

    if (players.length === 0) {
      state.leaderPlayerId =
        undefined

      return
    }

    players.sort((a, b) => {
      return b.points - a.points
    })

    state.leaderPlayerId =
      players[0].id
  }
}