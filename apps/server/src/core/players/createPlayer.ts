import { MatchPlayer } from "../../models/MatchState"

export function createPlayer(
  twitchUserId: string,
  nickname: string,
  avatarId: string
): MatchPlayer {
  return {
    twitchUserId,

    nickname,

    avatarId,

    points: 0,

    eliminated: false,

    connected: true,

    lastCommandAt: 0,
  }
}