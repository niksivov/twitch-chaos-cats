import {
  PlayerSnapshot,
  MatchEventSnapshot,
  BoosterSnapshot,
  StateUpdatePayload,
} from "@twitch-chaos-cats/shared-types"

import { Match } from "../core/Match"

export function createStateSnapshot(
  match: Match
): StateUpdatePayload {
  const state = match.state

  const players: PlayerSnapshot[] =
    state.playerOrder
      .map((playerId) => {
        return state.playersById[playerId]
      })
      .sort((a, b) => {
        return b.points - a.points
      })
      .map((player) => {
        return {
          id: player.id,

          nickname:
            player.nickname,

          avatarId:
            player.avatarId,

          points: player.points,

          eliminated:
            player.eliminated,
        }
      })

  const recentEvents: MatchEventSnapshot[] =
    state.recentEvents.map(
      (event) => {
        return {
          id: event.id,

          text: event.text,
        }
      }
    )

  const boosterSet: BoosterSnapshot[] =
    state.boosterSet.map(
      (booster) => {
        return {
          slot: booster.slot,

          boosterId:
            booster.boosterId,

          boosterName:
            booster.boosterName,
        }
      }
    )

  return {
    roomId: state.roomId,

    phase: state.phase,

    tick: state.tick,

    currentTurnPlayerId:
      state.currentTurnPlayerId,

    currentTurnStartedAt:
      state.currentTurnStartedAt,

    leaderPlayerId:
      state.leaderPlayerId,

    players,

    recentEvents,

    boosterSet,
  }
}