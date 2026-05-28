import { MatchManager } from './MatchManager'

import {
  MatchSettings,
  Player
} from '../network/types'

import { AvatarManager } from './avatars/AvatarManager'

export default class GameManager {
  private matchManager =
    new MatchManager()

  private avatarManager =
    new AvatarManager()

  createMatch(
    channelName: string,
    settings: MatchSettings
  ) {
    this.matchManager.createMatch(
      channelName,
      settings
    )
  }

  joinMatch(
    channelName: string,
    player: Omit<
      Player,
      'avatarId'
    >
  ) {
    const avatarId =
      this.avatarManager.assignAvatar()

    this.matchManager.joinMatch(
      channelName,
      {
        ...player,
        avatarId
      }
    )
  }

  startMatch(
    channelName: string
  ) {
    this.matchManager.startMatch(
      channelName
    )
  }

  getMatchManager() {
    return this.matchManager
  }
}