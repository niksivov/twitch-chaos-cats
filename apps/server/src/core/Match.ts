import { MatchPhase } from "./matchPhase"

import { MatchStateMachine } from "./MatchStateMachine"

import { BoosterSetItem } from "./boosters/BoosterSetManager"

import { ActiveEffect } from "./effects/EffectEngine"

import { EventLogEntry } from "./events/EventLog"

export interface MatchPlayer {
  id: string

  username: string

  score: number

  isAlive: boolean

  connected: boolean
}

export interface MatchInternalState {
  tick: number

  paused: boolean

  leaderId: string | null

  selectedBooster: any

  turnStartedAt: number | null

  turnEndsAt: number | null

  boosterPool: string[]

  boosterSet: BoosterSetItem[]

  effects: ActiveEffect[]

  eventLog: EventLogEntry[]

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
      tick: 0,

      paused: false,

      leaderId: null,

      selectedBooster: null,

      turnStartedAt: null,

      turnEndsAt: null,

      boosterPool: [],

      boosterSet: [],

      effects: [],

      eventLog: [],

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
  ): void {
    if (
      this.phase !==
      MatchPhase.WAITING_FOR_PLAYERS
    ) {
      throw new Error(
        "Cannot join active match"
      )
    }

    const alreadyExists =
      this.players.some(
        (player) =>
          player.id === id
      )

    if (alreadyExists) {
      return
    }

    const player: MatchPlayer =
      {
        id,

        username,

        score: 0,

        isAlive: true,

        connected: true,
      }

    this.players.push(player)

    this.state.playersById[
      id
    ] = player
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

  public getAlivePlayers(): MatchPlayer[] {
    return this.players.filter(
      (player) =>
        player.isAlive
    )
  }

  public finish(
    winnerId: string
  ): void {
    this.winnerId = winnerId

    this.transition(
      MatchPhase.MATCH_END
    )
  }

  public reset(): void {
    this.transition(
      MatchPhase.RESETTING
    )

    this.round = 0

    this.turn = 0

    this.currentPlayerId =
      null

    this.winnerId = null

    this.players.length = 0

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

    this.state.boosterPool =
      []

    this.state.boosterSet =
      []

    this.state.effects = []

    this.state.eventLog = []

    this.state.playersById =
      {}

    this.transition(
      MatchPhase.WAITING_FOR_PLAYERS
    )
  }
}