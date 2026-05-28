import { MatchPlayer } from "../../models/MatchState"

export function createPlayer(
  id: string,
  nickname: string,
  avatarId: string
): MatchPlayer {
  return {
    id,

    nickname,

    avatarId,

    points: 0,

    eliminated: false,

    connected: true,

    activeEffects: [],

    lastCommandAt: 0,
  }
}