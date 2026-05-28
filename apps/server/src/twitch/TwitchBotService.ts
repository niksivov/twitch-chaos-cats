import tmi from "tmi.js"

import { CommandQueue } from "../core/CommandQueue"

import { parseChatCommand } from "./parseChatCommand"

export class TwitchBotService {
  private client: tmi.Client

  constructor(
    private channel: string,

    private commandQueue: CommandQueue
  ) {
    this.client = new tmi.Client({
      channels: [channel],
    })
  }

  async start() {
    await this.client.connect()

    console.log(
      `[TWITCH] Connected to ${this.channel}`
    )

    this.client.on(
      "message",
      (
        channel,
        tags,
        message,
        self
      ) => {
        if (self) {
          return
        }

        const parsed =
          parseChatCommand(message)

        if (!parsed) {
          return
        }

        const username =
          tags.username

        if (!username) {
          return
        }

        this.commandQueue.enqueue({
          id: crypto.randomUUID(),

          roomId: this.channel,

          playerId: username,

          type: parsed.type,

          payload: parsed.payload,

          createdAt: Date.now(),
        })
      }
    )
  }
}