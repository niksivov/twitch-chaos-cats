import { Match } from "./Match"

import { createPlayer } from "./players/createPlayer"

import { AvatarManager } from "./avatars/AvatarManager"

import { SessionManager } from "./sessions/SessionManager"

export class PlayerManager {
  private avatarManager =
    new AvatarManager()

  constructor(
    private sessionManager: SessionManager
  ) {}

  addPlayer(
    match: Match,
    playerId: string
  ) {
    const exists =
      match.state.playersById[playerId]

    if (exists) {
      exists.connected = true

      this.sessionManager.connect(
        match.state.roomId,
        playerId
      )

      return exists
    }

    const maxPlayers =
      match.state.settings
        .maxPlayers

    const currentPlayers =
      match.state.playerOrder.length

    if (
      currentPlayers >=
      maxPlayers
    ) {
      return
    }

    const avatarId =
      this.avatarManager.getRandom()

    const player = createPlayer(
      playerId,
      playerId,
      avatarId
    )

    match.state.playersById[player.id] =
      player

    match.state.playerOrder.push(
      player.id
    )

    this.sessionManager.connect(
      match.state.roomId,
      player.id
    )

    return player
  }

  disconnectPlayer(
    match: Match,
    playerId: string
  ) {
    const player =
      match.state.playersById[playerId]

    if (!player) {
      return
    }

    player.connected = false

    this.sessionManager.disconnect(
      playerId
    )
  }
}