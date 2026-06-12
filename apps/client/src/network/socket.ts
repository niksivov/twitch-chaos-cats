import { useGameStore } from "../store/gameStore"

export interface MatchSettings {
  twitchChannel: string
  maxPlayers: number
  turnTimeSeconds: number
  targetPoints: number
  boosterSetSize: number
}

class SocketClient {
  private socket: WebSocket | null = null
  public onMessage?: (data: any) => void

connect() {
  const WS_URL =
    window.location.hostname === "localhost"
      ? "ws://localhost:8080"
      : `wss://${window.location.host}`

  const socket = new WebSocket(WS_URL)
  this.socket = socket

    socket.onopen = () => {
      useGameStore.getState().setConnected(true)
      socket.send(JSON.stringify({ type: "GET_LOBBY" }))
      console.log("websocket connected")
    }

    socket.onclose = () => {
      useGameStore.getState().setConnected(false)
      console.log("websocket disconnected")
      setTimeout(() => this.connect(), 2000)
    }

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)

        if (this.onMessage) this.onMessage(message)

        // ======================
        // LOBBY
        // ======================
        if (message.type === "lobby_state") {
          useGameStore.getState().setLobbyPlayers(
            message.payload?.players ?? []
          )
          return
        }

        // ======================
        // MATCH STATE (игра идёт)
        // ======================
        if (message.type === "match_state") {
          const match = message.payload
          if (!match) return

          // 💣 ВАЖНО: если матч уже завершён — игнорируем любые дальнейшие апдейты
          if (useGameStore.getState().matchFinished) {
            return
          }

          const prevPlayers = useGameStore.getState().players

          const players = (
            match.players?.length ? match.players : prevPlayers
          ).map((player: any) => ({
            id: player.id,
            twitchUserId: player.twitchUserId,
            nickname: player.username,
            avatarId: player.avatarId ?? "CAT",
            points: player.score,
            eliminated: !player.isAlive,
          }))

          const recentEvents = (match.recentEvents ?? []).map((event: any) => ({
            id: event.id ?? crypto.randomUUID(),
            message: event.message ?? event.text ?? "",
          }))

          const boosterSet = (match.boosterSet ?? []).map((booster: any) => ({
            slot: booster.slot,
            boosterName: booster.boosterName ?? "Unknown Booster",
            boosterIcon: booster.boosterIcon ?? "",
          }))

          useGameStore.getState().applySnapshot({
            roomId: match.roomId ?? match.id ?? "",
            phase: match.phase ?? "LOBBY",
            tick: match.tick ?? 0,
            round: match.round ?? 0,
            currentTurnPlayerId:
              match.currentTurnPlayerId ?? match.currentPlayerId,
            currentTurnStartedAt: match.currentTurnStartedAt,
            leaderPlayerId:
              match.leaderPlayerId ?? match.leaderId,
            players,
            recentEvents,
            boosterSet,
            turnOrder: match.turnOrder ?? [],
          })

          return
        }

        // ======================
        // MATCH RESULT (ФИНАЛ)
        // ======================
        if (message.type === "match_result") {
          const payload = message.payload

          useGameStore.setState({
            matchFinished: true,
            matchWinnerId: payload.winnerId,
            matchPlayers: payload.players ?? [],
            matchWinReason: payload.reason ?? "points",
            screen: "RESULT",
          })

          return
        }

        // ======================
        // LEGACY fallback
        // ======================
        if (message.type === "matchFinished") {
          useGameStore.setState({
            matchFinished: true,
            matchWinnerId: message.winnerId,
            matchPlayers: message.players ?? [],
            matchWinReason: message.reason ?? "points",
            screen: "RESULT",
          })
        }

      } catch (e) {
        console.error(e)
      }
    }
  }

  sendMessage(data: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return
    this.socket.send(JSON.stringify(data))
  }

  createMatch(settings: MatchSettings) {
    this.sendMessage({
      type: "CREATE_MATCH",
      payload: settings,
    })
  }

  selectBooster(slot: number) {
    this.sendMessage({
      type: "SELECT_BOOSTER",
      payload: { slot },
    })
  }
}

export const socketClient = new SocketClient()