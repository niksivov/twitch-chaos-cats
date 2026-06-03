import { useGameStore } from "../store/gameStore"

export interface MatchSettings {
  turnTimerSeconds: number
  targetPoints: number
  boosterSetSize: number
}

class SocketClient {
  private socket: WebSocket | null = null

  // Опциональная callback для всех входящих сообщений
  public onMessage?: (data: any) => void

  connect() {
    this.socket = new WebSocket("ws://localhost:8080")

    this.socket.onopen = () => {
      useGameStore.getState().setConnected(true)
      console.log("websocket connected")
    }

    this.socket.onclose = () => {
      useGameStore.getState().setConnected(false)
      console.log("websocket disconnected")
      setTimeout(() => this.connect(), 2000)
    }

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)

        // 🔹 Общий callback
        if (this.onMessage) {
          this.onMessage(message)
        }

        if (message.type !== "match_state") {
          return
        }

        const match = message.payload?.match
        if (!match) return

        console.log("PHASE", match.phase)
        console.log("WINNER", match.winnerId)

        const players = (match.players ?? []).map((player: any) => ({
          id: player.id,
          nickname: player.username,
          avatarId: player.username?.slice(0, 2).toUpperCase() ?? "CAT",
          points: player.score,
          eliminated: !player.isAlive,
        }))

        const recentEvents = (match.state?.eventLog ?? []).map((event: any) => ({
          id: event.id ?? crypto.randomUUID(),
          message: event.message ?? "",
        }))

        const boosterSet = (match.state?.boosterSet ?? []).map((booster: any) => ({
          slot: booster.slot,
          boosterName: booster.boosterName ?? "Unknown Booster",
          boosterIcon: booster.boosterIcon ?? "",
        }))

        // 🔹 Обновляем snapshot
        useGameStore.getState().applySnapshot({
          roomId: match.id ?? "",
          phase: match.phase ?? "LOBBY",
          tick: match.state?.tick ?? 0,
          round: match.round ?? 0,
          currentTurnPlayerId: match.currentPlayerId,
          currentTurnStartedAt: match.state?.turnStartedAt ?? undefined,
          leaderPlayerId: match.state?.leaderId ?? undefined,
          players,
          recentEvents,
          boosterSet,
        })

        // 🔹 Обновляем store для финального экрана
        if (match.phase === "MATCH_END" && match.winnerId) {
          useGameStore.setState({
            matchFinished: true,
            matchWinnerId: match.winnerId,
            matchPlayers: players,
            matchWinReason: "points",
          })
        }

      } catch (error) {
        console.error(error)
      }
    }
  }

  createMatch(settings: MatchSettings) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return

    this.socket.send(
      JSON.stringify({
        type: "CREATE_MATCH",
        payload: settings,
      })
    )
  }

  selectBooster(slot: number) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return

    this.socket.send(
      JSON.stringify({
        type: "SELECT_BOOSTER",
        payload: { slot },
      })
    )
  }
}

export const socketClient = new SocketClient()