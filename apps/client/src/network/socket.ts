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
      socket.send(JSON.stringify({ type: "GET_BOOSTER_LIST" }))
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
        // ROOM JOINED
        // ======================
        if (message.type === "room_joined") {
          const { channel, hasMatch, phase, lobbyPlayers, turnTimeSeconds, targetPoints } = message.payload

          useGameStore.setState({ twitchChannel: channel })
          useGameStore.getState().setLobbyPlayers(lobbyPlayers ?? [])

          if (turnTimeSeconds !== undefined) {
            useGameStore.setState({ turnTimeSeconds })
          }
          if (targetPoints !== undefined) {
            useGameStore.setState({ targetPoints })
          }

          if (hasMatch && phase !== "WAITING_FOR_PLAYERS") {
            useGameStore.setState({ screen: "GAME" })
          } else {
            useGameStore.setState({ screen: "MATCH_SETTINGS" })
          }
          return
        }

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
        // BOOSTER CATALOG
        // ======================
        if (message.type === "booster_list") {
          useGameStore.setState({
            boosterCatalog: message.payload ?? [],
          })
          return
        }

        // ======================
        // MATCH STATE (игра идёт)
        // ======================
        if (message.type === "match_state") {
          const match = message.payload
          if (!match) return

          if (useGameStore.getState().matchFinished) {
            return
          }

          if (match.turnTimeSeconds !== undefined) {
            useGameStore.setState({ turnTimeSeconds: match.turnTimeSeconds })
          }
          if (match.targetPoints !== undefined) {
            useGameStore.setState({ targetPoints: match.targetPoints })
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

          const maxScore = Math.max(...players.map((p: any) => p.points))
          const leaderIds = players
            .filter((p: any) => p.points === maxScore)
            .map((p: any) => p.id)

          const recentEvents = (match.recentEvents ?? []).map((event: any) => ({
            id: event.id ?? crypto.randomUUID(),
            message: event.message ?? event.text ?? "",
          }))

          const boosterSet = (match.boosterSet ?? []).map((booster: any) => ({
            slot: booster.slot,
            boosterName: booster.boosterName ?? "Unknown Booster",
            boosterIcon: booster.boosterIcon ?? "",
            description: booster.description ?? "",
          }))

          useGameStore.getState().applySnapshot({
            roomId: match.roomId ?? match.id ?? "",
            phase: match.phase ?? "LOBBY",
            tick: match.tick ?? 0,
            round: match.round ?? 0,
            currentTurnPlayerId:
              match.currentTurnPlayerId ?? match.currentPlayerId,
            currentTurnStartedAt: match.currentTurnStartedAt,
            leaderIds,
            players,
            recentEvents,
            boosterSet,
            turnOrder: match.turnOrder ?? [],
          })

          return
        }

        // ======================
        // WHEEL RESULT
        // ======================
        if (message.type === "wheel_result") {
          useGameStore.setState({
            wheelResult: message.payload,
          })
          return
        }

        // ======================
        // PANDORA RESULT
        // ======================
        if (message.type === "pandora_result") {
          useGameStore.setState({
            pandoraResult: message.payload,
          })
          return
        }

        // ======================
        // MATCH RESULT
        // ======================
        if (message.type === "match_result") {
          const payload = message.payload

          const hasWheel = useGameStore.getState().wheelResult !== null

          useGameStore.setState({
            matchFinished: true,
            matchWinnerId: payload.winnerId,
            matchPlayers: payload.players ?? [],
            matchWinReason: payload.reason ?? "points",
            ...(hasWheel ? {} : { screen: "RESULT" }),
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

  joinRoom(channel: string) {
    this.sendMessage({
      type: "JOIN_ROOM",
      payload: { channel },
    })
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

  pandoraDone() {
    this.sendMessage({
      type: "PANDORA_DONE",
    })
  }
}

export const socketClient = new SocketClient()
