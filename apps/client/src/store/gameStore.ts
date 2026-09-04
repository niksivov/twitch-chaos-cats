import { create } from "zustand"

// 🔹 Состояние матча — просто string от бэка
type MatchPhase = string

type AppScreen =
  | "CHANNEL_SELECT"
  | "MATCH_SETTINGS"
  | "GAME"
  | "RESULT"

interface PlayerSnapshot {
  id: string
  twitchUserId: string
  nickname: string
  avatarId: string
  points: number
  eliminated: boolean
}

interface MatchEventSnapshot {
  id: string
  message: string
}

interface BoosterSnapshot {
  slot: number
  boosterName: string
  boosterIcon: string
  description: string
}

export interface BoosterCatalogItem {
  id: string
  name: string
  description: string
  icon: string
  poolCount: number
}

interface LobbyPlayer {
  twitchUserId: string
  username: string
  avatarId: string
}

interface StateUpdatePayload {
  roomId: string
  phase: MatchPhase
  tick: number
  round?: number
  currentTurnPlayerId?: string
  currentTurnStartedAt?: number
  leaderIds: string[]
  players: PlayerSnapshot[]
  recentEvents: MatchEventSnapshot[]
  boosterSet: BoosterSnapshot[]
  turnOrder?: string[]
  matchFinished?: boolean
  matchWinnerId?: string | null
  matchPlayers?: PlayerSnapshot[]
  matchWinReason?: string
}

interface WheelPlayer {
  id: string
  username: string
  avatarId: string
  score: number
  probability: number
}

interface WheelResult {
  players: WheelPlayer[]
  winnerId: string
}

interface GameState {
  connected: boolean
  screen: AppScreen
  twitchChannel: string
  maxPlayers: number

  roomId: string
  phase: MatchPhase
  tick: number
  round: number
  currentTurnPlayerId?: string
  currentTurnStartedAt?: number
  leaderIds: string[]
  players: PlayerSnapshot[]
  recentEvents: MatchEventSnapshot[]
  boosterSet: BoosterSnapshot[]
  turnOrder: string[]
  lobbyPlayers: LobbyPlayer[]

  turnTimeSeconds: number
  targetPoints: number
  boosterSetSize: number

  matchFinished: boolean
  matchWinnerId?: string
  matchPlayers: PlayerSnapshot[]
  matchWinReason?: string

  wheelResult?: WheelResult | null

  boosterCatalog: BoosterCatalogItem[]

  setConnected: (connected: boolean) => void
  setScreen: (screen: AppScreen) => void
  setTwitchChannel: (channel: string) => void
  setMaxPlayers: (value: number) => void
  setTurnTimeSeconds: (value: number) => void
  setTargetPoints: (value: number) => void
  setBoosterSetSize: (value: number) => void
  setLobbyPlayers: (players: LobbyPlayer[]) => void
  applySnapshot: (snapshot: StateUpdatePayload) => void
  resetToStart: () => void
}

export const useGameStore = create<GameState>((set) => ({
  connected: false,
  screen: "CHANNEL_SELECT",
  twitchChannel: "",
  maxPlayers: 20,

  roomId: "",
  phase: "LOBBY",
  tick: 0,
  round: 0,
  currentTurnPlayerId: undefined,
  currentTurnStartedAt: undefined,
  leaderIds: [],
  players: [],
  recentEvents: [],
  boosterSet: [],
  turnOrder: [],
  lobbyPlayers: [],

  turnTimeSeconds: 30,
  targetPoints: 100,
  boosterSetSize: 3,

  matchFinished: false,
  matchWinnerId: undefined,
  matchPlayers: [],
  matchWinReason: undefined,

  wheelResult: null,

  boosterCatalog: [],

  setConnected: (connected) => set({ connected }),
  setScreen: (screen) => set({ screen }),
  setTwitchChannel: (twitchChannel) => set({ twitchChannel }),
  setMaxPlayers: (maxPlayers) => set({ maxPlayers }),
  setTurnTimeSeconds: (value) => set({ turnTimeSeconds: value }),
  setTargetPoints: (value) => set({ targetPoints: value }),
  setBoosterSetSize: (value) => set({ boosterSetSize: value }),
  setLobbyPlayers: (players) => set({ lobbyPlayers: players }),

  applySnapshot: (snapshot) =>
    set({
      roomId: snapshot.roomId ?? "",
      phase: snapshot.phase ?? "LOBBY",
      tick: snapshot.tick ?? 0,
      round: snapshot.round ?? 0,

      currentTurnPlayerId: snapshot.currentTurnPlayerId ?? undefined,

      currentTurnStartedAt:
        typeof snapshot.currentTurnStartedAt === "number"
          ? snapshot.currentTurnStartedAt
          : undefined,

      leaderIds: snapshot.leaderIds ?? [],

      players: snapshot.players ?? [],
      turnOrder: snapshot.turnOrder ?? [],
      recentEvents: snapshot.recentEvents ?? [],
      boosterSet: snapshot.boosterSet ?? [],
      matchFinished: snapshot.matchFinished ?? false,
      matchWinnerId: snapshot.matchWinnerId ?? undefined,
      matchPlayers: snapshot.matchPlayers ?? [],
      matchWinReason: snapshot.matchWinReason ?? undefined,

      // ❗ ВАЖНО: больше НЕТ логики screen на фазах
      // экран теперь НЕ выводится из фаз
      // (UI должен решать это сам в App)
    }),

    resetToStart: () =>
      set({
        screen: "CHANNEL_SELECT",

        maxPlayers: 20,

        roomId: "",
        phase: "LOBBY",
        tick: 0,
        round: 0,
        currentTurnPlayerId: undefined,
        currentTurnStartedAt: undefined,
        leaderIds: [],
        players: [],
        recentEvents: [],
        boosterSet: [],
        turnOrder: [],
        lobbyPlayers: [],

        matchFinished: false,
        matchWinnerId: undefined,
        matchPlayers: [],
        matchWinReason: undefined,

  wheelResult: null,
      }),
}))