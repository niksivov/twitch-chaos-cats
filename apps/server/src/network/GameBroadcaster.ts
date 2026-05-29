import { Server } from "ws"

import { Match } from "../core/Match"

export class GameBroadcaster {
  constructor(
    private readonly wss: Server
  ) {}

  broadcastMatchState(
    match: Match
  ) {
    const payload = {
      type: "MATCH_STATE",

      data: {
        id: match.id,

        phase: match.phase,

        round: match.round,

        turn: match.turn,

        currentPlayerId:
          match.currentPlayerId,

        winnerId:
          match.winnerId,

        leaderId:
          match.state.leaderId,

        turnStartedAt:
          match.state
            .turnStartedAt,

        turnEndsAt:
          match.state.turnEndsAt,

        selectedBooster:
          match.state
            .selectedBooster,

        players:
          match.players.map(
            (player) => ({
              id: player.id,

              username:
                player.username,

              score:
                player.score,

              isAlive:
                player.isAlive,

              connected:
                player.connected,
            })
          ),
      },
    }

    const serialized =
      JSON.stringify(payload)

    for (const client of this.wss
      .clients) {
      if (
        client.readyState !==
        client.OPEN
      ) {
        continue
      }

      client.send(serialized)
    }
  }
}