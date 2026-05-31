import { randomUUID } from "crypto"

import { MatchPhase } from "./matchPhase"

import { MatchStateMachine } from "./MatchStateMachine"

import { BoosterSetItem } from "./boosters/BoosterSetManager"

import { ActiveEffect } from "./effects/EffectEngine"

import { EventLogEntry } from "./events/EventLog"

export const DISCONNECT_GRACE_MS =
  30000

const EMPTY_MATCH_TIMEOUT_MS =
  60000

const MATCH_RESET_DELAY_MS =
  5000

export interface MatchPlayer {
  id: string

  username: string

  runtimeId: string

  score: number

  isAlive: boolean

  connected: boolean

  disconnectedAt: number | null
}

export interface MatchInternalState {
  runtimeId: string

  tick: number

  paused: boolean

  leaderId: string | null

  selectedBooster: any

  turnStartedAt: number | null

  turnEndsAt: number | null

  turnResolvedAt: number | null

  matchEndedAt: number | null

  emptySince: number | null

  boosterPool: string[]

  boosterSet: BoosterSetItem[]

  effects: ActiveEffect[]

  eventLog: EventLogEntry[]

  roundPlayedPlayerIds: string[]

  playersById: Record<
    string,
    MatchPlayer
  >
}

export class Match {
  public readonly id: string

  public phase: MatchPhase

  public round: number

  public turn: number

  public currentPlayerId:
    | string
    | null

  public winnerId:
    | string
    | null

  public readonly players:
    MatchPlayer[]

  public readonly state: MatchInternalState

  private readonly stateMachine: MatchStateMachine

  constructor(matchId: string) {
    this.id = matchId

    this.phase =
      MatchPhase.WAITING_FOR_PLAYERS

    this.round = 0

    this.turn = 0

    this.currentPlayerId =
      null

    this.winnerId = null

    this.players = []

    this.state = {
      runtimeId: randomUUID(),

      tick: 0,

      paused: false,

      leaderId: null,

      selectedBooster: null,

      turnStartedAt: null,

      turnEndsAt: null,

      turnResolvedAt: null,

      matchEndedAt: null,

      emptySince: null,

      boosterPool: [],

      boosterSet: [],

      effects: [],

      eventLog: [],

      roundPlayedPlayerIds: [],

      playersById: {},
    }

    this.stateMachine =
      new MatchStateMachine(
        this.phase
      )
  }

  public transition(
    next: MatchPhase
  ): void {
    this.stateMachine.transition(
      next
    )

    this.phase = next
  }

  public addPlayer(
    id: string,

    username: string
  ): MatchPlayer {
    const existing =
      this.state.playersById[
        id
      ]

    if (existing) {
      existing.connected = true

      existing.disconnectedAt =
        null

      existing.runtimeId =
        randomUUID()

      this.state.emptySince =
        null

      return existing
    }

    if (
      this.phase !==
      MatchPhase.WAITING_FOR_PLAYERS
    ) {
      throw new Error(
        "Cannot join active match"
      )
    }

    const player: MatchPlayer =
      {
        id,

        username,

        runtimeId:
          randomUUID(),

        score: 0,

        isAlive: true,

        connected: true,

        disconnectedAt:
          null,
      }

    this.players.push(player)

    this.state.playersById[
      id
    ] = player

    this.state.emptySince =
      null

    return player
  }

  public validateRuntime(
    runtimeId: string
  ): boolean {
    return (
      runtimeId ===
      this.state.runtimeId
    )
  }

  public validatePlayerRuntime(
    player: MatchPlayer,

    runtimeId: string
  ): boolean {
    return (
      player.runtimeId ===
      runtimeId
    )
  }

  public disconnectPlayer(
    playerId: string
  ): void {
    const player =
      this.state.playersById[
        playerId
      ]

    if (!player) {
      return
    }

    player.connected = false

    player.disconnectedAt =
      Date.now()

    if (
      this.getActivePlayers()
        .length === 0
    ) {
      this.state.emptySince =
        Date.now()
    }
  }

  public reconnectPlayer(
    playerId: string,

    matchRuntimeId: string,

    playerRuntimeId: string
  ): boolean {
    if (
      !this.validateRuntime(
        matchRuntimeId
      )
    ) {
      return false
    }

    const player =
      this.state.playersById[
        playerId
      ]

    if (!player) {
      return false
    }

    if (
      !this.validatePlayerRuntime(
        player,

        playerRuntimeId
      )
    ) {
      return false
    }

    player.connected = true

    player.disconnectedAt =
      null

    this.state.emptySince =
      null

    return true
  }

  public cleanupExpiredDisconnectedPlayers(): string[] {
    const removedPlayerIds:
      string[] = []

    const now = Date.now()

    for (const player of [
      ...this.players,
    ]) {
      if (player.connected) {
        continue
      }

      if (
        !player.disconnectedAt
      ) {
        continue
      }

      const expired =
        now -
          player.disconnectedAt >
        DISCONNECT_GRACE_MS

      if (!expired) {
        continue
      }

      removedPlayerIds.push(
        player.id
      )

      this.removePlayer(
        player.id
      )
    }

    return removedPlayerIds
  }

  public isPlayerActive(
    player: MatchPlayer
  ): boolean {
    if (player.connected) {
      return true
    }

    if (
      !player.disconnectedAt
    ) {
      return false
    }

    return (
      Date.now() -
        player.disconnectedAt <
      DISCONNECT_GRACE_MS
    )
  }

  public getAlivePlayers(): MatchPlayer[] {
    return this.players.filter(
      (player) =>
        player.isAlive
    )
  }

  public getActivePlayers(): MatchPlayer[] {
    return this
      .getAlivePlayers()
      .filter((player) =>
        this.isPlayerActive(
          player
        )
      )
  }

  public markCurrentPlayerAsPlayed(): void {
    if (
      !this.currentPlayerId
    ) {
      return
    }

    if (
      this.state.roundPlayedPlayerIds.includes(
        this.currentPlayerId
      )
    ) {
      return
    }

    this.state.roundPlayedPlayerIds.push(
      this.currentPlayerId
    )
  }

  public hasRoundFinished(): boolean {
    const activePlayers =
      this.getActivePlayers()

    return activePlayers.every(
      (player) =>
        this.state.roundPlayedPlayerIds.includes(
          player.id
        )
    )
  }

  public resetRoundProgress(): void {
    this.state.roundPlayedPlayerIds =
      []
  }

  public isAbandoned(): boolean {
    if (
      this.state.emptySince ===
      null
    ) {
      return false
    }

    return (
      Date.now() -
        this.state.emptySince >
      EMPTY_MATCH_TIMEOUT_MS
    )
  }

  public shouldReset(): boolean {
    if (
      this.phase !==
      MatchPhase.MATCH_END
    ) {
      return false
    }

    if (
      this.state.matchEndedAt ===
      null
    ) {
      return false
    }

    return (
      Date.now() -
        this.state.matchEndedAt >
      MATCH_RESET_DELAY_MS
    )
  }

  public removePlayer(
    id: string
  ): void {
    const index =
      this.players.findIndex(
        (player) =>
          player.id === id
      )

    if (index === -1) {
      return
    }

    this.players.splice(index, 1)

    delete this.state
      .playersById[id]

    if (
      this.getActivePlayers()
        .length === 0
    ) {
      this.state.emptySince =
        Date.now()
    }
  }

  public start(): void {
    if (
      this.players.length < 2
    ) {
      throw new Error(
        "Not enough players"
      )
    }

    this.transition(
      MatchPhase.STARTING
    )

    this.round = 1

    this.turn = 1

    this.currentPlayerId =
      null

    this.winnerId = null

    this.state.turnStartedAt =
      null

    this.state.turnEndsAt =
      null

    this.state.turnResolvedAt =
      null

    this.state.matchEndedAt =
      null

    this.state.selectedBooster =
      null

    this.state.emptySince =
      null

    this.state.roundPlayedPlayerIds =
      []

    this.transition(
      MatchPhase.ROUND_START
    )
  }

  public setCurrentPlayer(
    playerId: string
  ): void {
    this.currentPlayerId =
      playerId
  }

  public eliminatePlayer(
    playerId: string
  ): void {
    const player =
      this.players.find(
        (p) =>
          p.id === playerId
      )

    if (!player) {
      return
    }

    player.isAlive = false
  }

  public finish(
    winnerId: string
  ): void {
    this.winnerId = winnerId

    this.currentPlayerId =
      null

    this.state.turnStartedAt =
      null

    this.state.turnEndsAt =
      null

    this.state.turnResolvedAt =
      null

    this.state.matchEndedAt =
      Date.now()

    this.state.selectedBooster =
      null

    this.transition(
      MatchPhase.MATCH_END
    )
  }

  public reset(): void {
    this.round = 0

    this.turn = 0

    this.currentPlayerId =
      null

    this.winnerId = null

    this.players.length = 0

    this.state.runtimeId =
      randomUUID()

    this.state.tick = 0

    this.state.paused = false

    this.state.leaderId =
      null

    this.state.selectedBooster =
      null

    this.state.turnStartedAt =
      null

    this.state.turnEndsAt =
      null

    this.state.turnResolvedAt =
      null

    this.state.matchEndedAt =
      null

    this.state.emptySince =
      null

    this.state.boosterPool =
      []

    this.state.boosterSet =
      []

    this.state.effects = []

    this.state.eventLog = []

    this.state.roundPlayedPlayerIds =
      []

    this.state.playersById =
      {}

    this.transition(
      MatchPhase.WAITING_FOR_PLAYERS
    )
  }
}