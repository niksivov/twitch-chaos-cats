import { useGameStore } from "../store/gameStore"

class SocketClient {
  private socket: WebSocket | null =
    null

  connect() {
    this.socket = new WebSocket(
      "ws://localhost:8080"
    )

    this.socket.onopen = () => {
      useGameStore
        .getState()
        .setConnected(true)

      console.log(
        "websocket connected"
      )
    }

    this.socket.onclose = () => {
      useGameStore
        .getState()
        .setConnected(false)

      console.log(
        "websocket disconnected"
      )

      setTimeout(() => {
        this.connect()
      }, 2000)
    }

    this.socket.onmessage = (
      event
    ) => {
      try {
        const message =
          JSON.parse(
            event.data
          )

        if (
          message.type !==
          "match_state"
        ) {
          return
        }

        const match =
          message.payload
            ?.match

        if (!match) {
          return
        }

        const players =
          (
            match.players ??
            []
          ).map(
            (player: any) => ({
              id: player.id,

              nickname:
                player.username,

              avatarId:
                player.username
                  ?.slice(
                    0,
                    2
                  )
                  .toUpperCase() ??
                "CAT",

              points:
                player.score,

              eliminated:
                !player.isAlive,
            })
          )

        const recentEvents =
          (
            match.state
              ?.eventLog ?? []
          ).map(
            (event: any) => ({
              id:
                event.id ??
                crypto.randomUUID(),

              message:
                event.message ??
                "",
            })
          )

        const boosterSet =
          (
            match.state
              ?.boosterSet ??
            []
          ).map(
            (booster: any) => ({
              slot:
                booster.slot,

              boosterName:
                booster.boosterName ??
                "Unknown Booster",
            })
          )

        useGameStore
          .getState()
          .applySnapshot({
            roomId:
              match.id ?? "",

            phase:
              match.phase ??
              "LOBBY",

            tick:
              match.state
                ?.tick ?? 0,

            currentTurnPlayerId:
              match.currentPlayerId,

            currentTurnStartedAt:
              match.state
                ?.turnStartedAt ??
              undefined,

            leaderPlayerId:
              match.state
                ?.leaderId ??
              undefined,

            players,

            recentEvents,

            boosterSet,
          })
      } catch (error) {
        console.error(error)
      }
    }
  }
}

export const socketClient =
  new SocketClient()