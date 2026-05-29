import { Match } from "./Match"

export class MatchManager {
  private readonly matches =
    new Map<string, Match>()

  createMatch(
    matchId: string
  ): Match {
    const existing =
      this.matches.get(
        matchId
      )

    if (existing) {
      return existing
    }

    const match =
      new Match(matchId)

    this.matches.set(
      matchId,
      match
    )

    return match
  }

  removeMatch(
    matchId: string
  ) {
    this.matches.delete(
      matchId
    )
  }

  getMatch(
    matchId: string
  ): Match | undefined {
    return this.matches.get(
      matchId
    )
  }

  getAllMatches(): Match[] {
    return [
      ...this.matches.values(),
    ]
  }

  joinPlayer(
    matchId: string,

    playerId: string,

    username: string
  ): Match {
    let match =
      this.matches.get(
        matchId
      )

    if (!match) {
      match =
        this.createMatch(
          matchId
        )
    }

    const existingPlayer =
      match.players.find(
        (player) =>
          player.id ===
          playerId
      )

    if (existingPlayer) {
      existingPlayer.connected =
        true

      return match
    }

    match.addPlayer(
      playerId,
      username
    )

    return match
  }

  disconnectPlayer(
    matchId: string,

    playerId: string
  ) {
    const match =
      this.matches.get(
        matchId
      )

    if (!match) {
      return
    }

    const player =
      match.players.find(
        (p) =>
          p.id === playerId
      )

    if (!player) {
      return
    }

    player.connected = false
  }

  reconnectPlayer(
    matchId: string,

    playerId: string
  ) {
    const match =
      this.matches.get(
        matchId
      )

    if (!match) {
      return
    }

    const player =
      match.players.find(
        (p) =>
          p.id === playerId
      )

    if (!player) {
      return
    }

    player.connected = true
  }

  cleanupEmptyMatches() {
    for (const [
      matchId,
      match,
    ] of this.matches) {
      const connectedPlayers =
        match.players.filter(
          (player) =>
            player.connected
        )

      if (
        connectedPlayers.length ===
        0
      ) {
        this.matches.delete(
          matchId
        )
      }
    }
  }
}