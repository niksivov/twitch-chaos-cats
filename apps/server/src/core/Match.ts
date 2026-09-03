import { randomUUID } from "crypto"
import { MatchPhase } from "./matchPhase"
import { MatchStateMachine } from "./MatchStateMachine"
import { BoosterSetItem } from "./boosters/BoosterSetManager"
import { ActiveEffect } from "./effects/EffectEngine"
import { EventLogEntry } from "./events/EventLog"

const EMPTY_MATCH_TIMEOUT_MS = 60000
const MATCH_RESET_DELAY_MS = 5000

export interface MatchPlayer {
  playerId: string
  twitchUserId: string
  username: string
  avatarId: string
  score: number
  isAlive: boolean
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
  recentEvents: any[]
  boosterPool: string[]
  boosterSet: BoosterSetItem[]
  effects: ActiveEffect[]
  eventLog: EventLogEntry[]
  roundPlayedPlayerIds: string[]

  twitchChannel: string | null
  maxPlayers: number
  registrationOpen: boolean
  registeredPlayers: Record<string, MatchPlayer>
  usedAvatarIds: string[]

  turnTimeSeconds: number
  targetPoints: number
  boosterSetSize: number
  exhaustiblePool: boolean
  boosterUsageCounts: Record<string, number>
  playerRpsCollection: Record<string, string[]>
  wheelResult: {
    players: {
      id: string
      username: string
      avatarId: string
      score: number
      probability: number
    }[]
    winnerId: string
  } | null
}

export class Match {
  public readonly id: string
  public phase: MatchPhase
  public round: number
  public turn: number
  public currentPlayerId: string | null
  public winnerId: string | null
  public turnOrder: string[] = []
  public readonly state: MatchInternalState
  private readonly stateMachine: MatchStateMachine

  // 🔹 Twitch → internal playerId mapping
  private twitchToPlayerId: Record<string, string> = {}

  constructor(matchId: string, settings?: any) {
    this.id = matchId
    this.phase = MatchPhase.WAITING_FOR_PLAYERS
    this.round = 0
    this.turn = 0
    this.currentPlayerId = null
    this.winnerId = null

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
      recentEvents: [],
      roundPlayedPlayerIds: [],
      registeredPlayers: {},
      usedAvatarIds: [],
      twitchChannel: null,
      maxPlayers: 0,
      registrationOpen: false,
      turnTimeSeconds: settings?.turnTimeSeconds ?? 30,
      targetPoints: settings?.targetPoints ?? 10,
      boosterSetSize: settings?.boosterSetSize ?? 3,
      exhaustiblePool: settings?.exhaustiblePool ?? true,
      boosterUsageCounts: {},
      playerRpsCollection: {},
      wheelResult: null,
    }

    this.stateMachine = new MatchStateMachine(this.phase)
  }

  // 🔹 получение игрока по Twitch ID
  public getPlayerByTwitchId(twitchUserId: string): MatchPlayer | null {
    const playerId = this.twitchToPlayerId[twitchUserId]
    if (!playerId) return null
    return this.state.registeredPlayers[playerId] ?? null
  }

  // 🔹 NEW: получение internal playerId по Twitch ID
  public getPlayerIdByTwitchId(twitchUserId: string): string | null {
    return this.twitchToPlayerId[twitchUserId] ?? null
  }

  public get players(): MatchPlayer[] {
    return Object.values(this.state.registeredPlayers)
  }

public toJSON() {
  return {
    id: this.id,
    phase: this.phase,
    round: this.round,
    turn: this.turn,
    turnOrder: this.turnOrder,
    currentTurnPlayerId: this.currentPlayerId,
    currentTurnStartedAt: this.state.turnStartedAt,
    turnTimeSeconds: this.state.turnTimeSeconds,
    targetPoints: this.state.targetPoints,

    leaderId: this.state.leaderId,

    // 👇 добавлен id для фронта
    players: Object.entries(this.state.registeredPlayers).map(([internalId, p]) => ({
      id: internalId,
      twitchUserId: p.twitchUserId,
      username: p.username,
      avatarId: p.avatarId,
      score: p.score,
      isAlive: p.isAlive,
    })),

    boosterSet: this.state.boosterSet,
    recentEvents: this.state.eventLog,

    // ↓ новые поля для фронта
    matchFinished: this.winnerId !== null,
    matchWinnerId: this.winnerId,
    matchPlayers: Object.entries(this.state.registeredPlayers).map(([internalId, p]) => ({
      id: internalId,
      twitchUserId: p.twitchUserId,
      username: p.username,
      avatarId: p.avatarId,
      score: p.score,
      isAlive: p.isAlive,
    })),
    matchWinReason: this.state.matchEndedAt ? "points" : undefined,
  }
}

  
  public transition(next: MatchPhase): void {
    this.stateMachine.transition(next)
    this.phase = next
  }

  public addTwitchPlayer(twitchUserId: string, username: string, avatarId: string): MatchPlayer | null {
    if (!this.state.registrationOpen) return null
    if (Object.keys(this.state.registeredPlayers).length >= this.state.maxPlayers) return null
    if (this.state.registeredPlayers[twitchUserId]) return null

const internalId = randomUUID()

    const player: MatchPlayer = {
      playerId: internalId,
      twitchUserId,
      username,
      avatarId,
      score: 0,
      isAlive: true,
    }


    this.twitchToPlayerId[twitchUserId] = internalId
    this.state.registeredPlayers[internalId] = player

    this.state.usedAvatarIds.push(avatarId)
    return player
  }

  public getActivePlayers(): MatchPlayer[] {
    return Object.values(this.state.registeredPlayers).filter(p => p.isAlive)
  }

  public getAlivePlayers(): MatchPlayer[] {
    return this.getActivePlayers()
  }

  public eliminatePlayer(twitchUserId: string): void {
    const player = this.getPlayerByTwitchId(twitchUserId)
    if (!player) return
    player.isAlive = false
  }

  public markCurrentPlayerAsPlayed(): void {
    if (!this.currentPlayerId) return
    if (this.state.roundPlayedPlayerIds.includes(this.currentPlayerId)) return
    this.state.roundPlayedPlayerIds.push(this.currentPlayerId)
  }

  public hasRoundFinished(): boolean {
    const active = this.getActivePlayers()
    return active.every(p => this.state.roundPlayedPlayerIds.includes(p.twitchUserId))
  }

  public resetRoundProgress(): void {
    this.state.roundPlayedPlayerIds = []
  }

  // 🔴 FIX: теперь currentPlayerId всегда internalId
  public setCurrentPlayer(twitchUserId: string): void {
    const internalId = this.twitchToPlayerId[twitchUserId]
    this.currentPlayerId = internalId ?? null
  }

  public reset(): void {
    this.transition(MatchPhase.RESETTING)

    this.round = 0
    this.turn = 0
    this.currentPlayerId = null
    this.winnerId = null

    this.state.tick = 0
    this.state.paused = false
    this.state.leaderId = null
    this.state.selectedBooster = null
    this.state.turnStartedAt = null
    this.state.turnEndsAt = null
    this.state.turnResolvedAt = null
    this.state.matchEndedAt = null
    this.state.emptySince = null
    this.state.boosterPool = []
    this.state.boosterSet = []
    this.state.effects = []
    this.state.eventLog = []
    this.state.roundPlayedPlayerIds = []
    this.state.registeredPlayers = {}
    this.state.usedAvatarIds = []
    this.state.twitchChannel = null
    this.state.maxPlayers = 0
    this.state.registrationOpen = false
    this.state.boosterUsageCounts = {}
    this.state.playerRpsCollection = {}
    this.state.wheelResult = null

    this.transition(MatchPhase.WAITING_FOR_PLAYERS)
  }

  public isAbandoned(): boolean {
    if (this.state.emptySince === null) return false
    return Date.now() - this.state.emptySince > EMPTY_MATCH_TIMEOUT_MS
  }

  public shouldReset(): boolean {
    if (!this.state.matchEndedAt) return false
    return Date.now() - this.state.matchEndedAt > MATCH_RESET_DELAY_MS
  }
}