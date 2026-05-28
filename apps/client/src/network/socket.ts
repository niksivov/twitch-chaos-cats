import {
  ServerMessage,
  StateUpdatePayload,
} from "@twitch-chaos-cats/shared-types"

import { useGameStore } from "../store/gameStore"

class SocketClient {
  private socket?: WebSocket

  private reconnectTimeout?: number

  connect() {
    this.socket = new WebSocket(
      "ws://localhost:3001"
    )

    this.socket.onopen = () => {
      useGameStore
        .getState()
        .setConnected(true)

      console.log(
        "[WS] connected"
      )
    }

    this.socket.onclose = () => {
      useGameStore
        .getState()
        .setConnected(false)

      console.log(
        "[WS] disconnected"
      )

      this.scheduleReconnect()
    }

    this.socket.onmessage = (
      event
    ) => {
      const message: ServerMessage<StateUpdatePayload> =
        JSON.parse(event.data)

      switch (message.type) {
        case "STATE_UPDATE":
          useGameStore
            .getState()
            .applySnapshot(
              message.payload
            )
          break
      }
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(
        this.reconnectTimeout
      )
    }

    this.reconnectTimeout =
      window.setTimeout(() => {
        this.connect()
      }, 2000)
  }
}

export const socketClient =
  new SocketClient()