import { randomUUID } from "crypto"
import { MatchPhase } from "./matchPhase"
import { MatchStateMachine } from "./MatchStateMachine"
import { BoosterSetItem } from "./boosters/BoosterSetManager"
import { ActiveEffect } from "./effects/EffectEngine"
import { EventLogEntry, EventLog } from "./events/EventLog"

export const DISCONNECT_GRACE_MS = 30000
const EMPTY_MATCH_TIMEOUT_MS = 60000
const MATCH_RESET_DELAY_MS = 5000

const eventLog = new EventLog()

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
  playersById: Record<string, MatchPlayer>

  turnTimeSeconds: number
  targetPoints: number
  boosterSetSize: number
  exhaustiblePool: boolean
}

export class Match {
  public readonly id: string
  public phase: MatchPhase
  public round: number
  public turn: number
  public currentPlayerId: string | null
  public winnerId: string | null
  public readonly players: MatchPlayer[]
  public readonly state: MatchInternalState
  private readonly stateMachine: MatchStateMachine

  constructor(matchId: string, settings?: any) {
    this.id = matchId
    this.phase = MatchPhase.WAITING_FOR_PLAYERS
    this.round = 0
    this.turn = 0
    this.currentPlayerId = null
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
      turnTimeSeconds: settings?.turnTimeSeconds ?? 15,
      targetPoints: settings?.targetPoints ?? 10,
      boosterSetSize: settings?.boosterSetSize ?? 3,
      exhaustiblePool: settings?.exhaustiblePool ?? true,
    }

    this.stateMachine = new MatchStateMachine(this.phase)
  }

  public transition(next: MatchPhase): void {
    this.stateMachine.transition(next)
    this.phase = next
  }

  public addPlayer(id: string, username: string): MatchPlayer {
    const existing = this.state.playersById[id]
    if (existing) {
      existing.connected = true
      existing.disconnectedAt = null
      existing.runtimeId = randomUUID()
      this.state.emptySince = null
      return existing
    }

    if (this.phase !== MatchPhase.WAITING_FOR_PLAYERS) {
      throw new Error("Cannot join active match")
    }

    const player: MatchPlayer = {
      id,
      username,
      runtimeId: randomUUID(),
      score: 0,
      isAlive: true,
      connected: true,
      disconnectedAt: null,
    }

    this.players.push(player)
    this.state.playersById[id] = player
    this.state.emptySince = null
    return player
  }

  public isPlayerActive(player: MatchPlayer): boolean {
    if (player.connected) return true
    if (!player.disconnectedAt) return false
    return Date.now() - player.disconnectedAt < DISCONNECT_GRACE_MS
  }

  public getActivePlayers(): MatchPlayer[] {
    return this.players.filter(p => p.isAlive && this.isPlayerActive(p))
  }

  public getAlivePlayers(): MatchPlayer[] {
    return this.players.filter(p => p.isAlive)
  }

  public removePlayer(id: string): void {
    const index = this.players.findIndex(p => p.id === id)
    if (index === -1) return
    this.players.splice(index, 1)
    delete this.state.playersById[id]
    if (this.getActivePlayers().length === 0) this.state.emptySince = Date.now()
  }

  public eliminatePlayer(playerId: string): void {
    const player = this.players.find(p => p.id === playerId)
    if (!player) return
    player.isAlive = false
  }

  public cleanupExpiredDisconnectedPlayers(): string[] {
    const removed: string[] = []
    const now = Date.now()
    for (const player of [...this.players]) {
      if (!player.connected && player.disconnectedAt) {
        if (now - player.disconnectedAt > DISCONNECT_GRACE_MS) {
          removed.push(player.id)
          this.removePlayer(player.id)
        }
      }
    }
    return removed
  }

  public isAbandoned(): boolean {
    if (this.state.emptySince === null) return false
    return Date.now() - this.state.emptySince > EMPTY_MATCH_TIMEOUT_MS
  }

  public shouldReset(): boolean {
    if (this.phase !== MatchPhase.MATCH_END) return false
    if (this.state.matchEndedAt === null) return false
    return Date.now() - this.state.matchEndedAt > MATCH_RESET_DELAY_MS
  }

  public validateRuntime(runtimeId: string): boolean {
    return runtimeId === this.state.runtimeId
  }

  public validatePlayerRuntime(player: MatchPlayer, runtimeId: string): boolean {
    return player.runtimeId === runtimeId
  }

  public disconnectPlayer(playerId: string): void {
    const player = this.state.playersById[playerId]
    if (!player) return
    player.connected = false
    player.disconnectedAt = Date.now()
    if (this.getActivePlayers().length === 0) this.state.emptySince = Date.now()
  }

  public reconnectPlayer(playerId: string, matchRuntimeId: string, playerRuntimeId: string): boolean {
    if (!this.validateRuntime(matchRuntimeId)) return false
    const player = this.state.playersById[playerId]
    if (!player) return false
    if (!this.validatePlayerRuntime(player, playerRuntimeId)) return false
    player.connected = true
    player.disconnectedAt = null
    this.state.emptySince = null
    return true
  }

  public markCurrentPlayerAsPlayed(): void {
    if (!this.currentPlayerId) return
    if (this.state.roundPlayedPlayerIds.includes(this.currentPlayerId)) return
    this.state.roundPlayedPlayerIds.push(this.currentPlayerId)
  }

  public hasRoundFinished(): boolean {
    const active = this.getActivePlayers()
    return active.every(p => this.state.roundPlayedPlayerIds.includes(p.id))
  }

  public resetRoundProgress(): void {
    this.state.roundPlayedPlayerIds = []
  }

  public start(): void {
    this.transition(MatchPhase.STARTING)
    this.round = 1
    this.turn = 1
    this.currentPlayerId = null
    this.winnerId = null
    this.state.turnStartedAt = null
    this.state.turnEndsAt = null
    this.state.turnResolvedAt = null
    this.state.matchEndedAt = null
    this.state.selectedBooster = null
    this.state.emptySince = null
    this.state.roundPlayedPlayerIds = []
    this.transition(MatchPhase.ROUND_START)
  }

  public setCurrentPlayer(playerId: string): void {
    this.currentPlayerId = playerId
  }

  public finish(winnerId: string): void {
    if (this.phase === MatchPhase.MATCH_END) return

    this.winnerId = winnerId
    this.currentPlayerId = null
    this.state.matchEndedAt = Date.now()
    this.state.selectedBooster = null

    const winner = this.state.playersById[winnerId]
    if (winner) {
      eventLog.add(this, `🏆 Победитель: ${winner.username}`)
    }

    this.transition(MatchPhase.MATCH_END)
  }

  public reset(): void {
    // ✅ переход через RESETTING для корректной проверки MatchStateMachine
    this.transition(MatchPhase.RESETTING)

    this.round = 0
    this.turn = 0
    this.currentPlayerId = null
    this.winnerId = null
    this.players.length = 0
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
    this.state.playersById = {}

    this.transition(MatchPhase.WAITING_FOR_PLAYERS)
  }
}