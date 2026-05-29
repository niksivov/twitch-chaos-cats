import { Server } from "ws"

import { Match } from "../core/Match"

import { ActiveEffect } from "../core/effects/EffectEngine"

import { EventLogEntry } from "../core/events/EventLog"

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

        tick:
          match.state.tick,

        turnStartedAt:
          match.state
            .turnStartedAt,

        turnEndsAt:
          match.state.turnEndsAt,

        selectedBooster:
          match.state
            .selectedBooster,

        boosterSet:
          match.state
            .boosterSet,

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

              isCurrentTurn:
                player.id ===
                match.currentPlayerId,

              isLeader:
                player.id ===
                match.state
                  .leaderId,
            })
          ),

        effects:
          (
            match.state
              .effects ??
            []
          ).map(
            (
              effect: ActiveEffect
            ) => ({
              id: effect.id,

              type:
                effect.type,

              playerId:
                effect.playerId,

              expiresAt:
                effect.expiresAt,
            })
          ),

        eventLog:
          (
            match.state
              .eventLog ??
            []
          ).map(
            (
              event: EventLogEntry
            ) => ({
              id: event.id,

              message:
                event.message,

              createdAt:
                event.createdAt,
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