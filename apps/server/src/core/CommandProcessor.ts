import { MatchManager } from "./MatchManager"

import { MatchPhase } from "./matchPhase"

export interface GameCommand {
  type: string

  matchId: string

  playerId: string

  payload?: any

  createdAt: number
}

export class CommandProcessor {
  private queue: GameCommand[] =
    []

  private readonly processedKeys =
    new Set<string>()

  private readonly cooldowns =
    new Map<string, number>()

  constructor(
    private readonly matchManager: MatchManager
  ) {}

  enqueue(
    command: GameCommand
  ) {
    const key =
      this.buildCommandKey(
        command
      )

    if (
      this.processedKeys.has(key)
    ) {
      return
    }

    this.processedKeys.add(key)

    this.queue.push(command)
  }

  process() {
    const commands = [
      ...this.queue,
    ]

    this.queue.length = 0

    for (const command of commands) {
      this.processCommand(
        command
      )
    }

    this.cleanup()
  }

  private processCommand(
    command: GameCommand
  ) {
    const match =
      this.matchManager.getMatch(
        command.matchId
      )

    if (!match) {
      return
    }

    switch (command.type) {
      case "SELECT_BOOSTER":
        this.handleSelectBooster(
          match,
          command
        )
        break
    }
  }

  private handleSelectBooster(
    match: any,
    command: GameCommand
  ) {
    if (
      match.phase !==
      MatchPhase.BOOSTER_SELECTION
    ) {
      return
    }

    if (
      command.playerId !==
      match.currentPlayerId
    ) {
      return
    }

    const cooldownKey =
      `${command.playerId}:SELECT_BOOSTER`

    const now = Date.now()

    const cooldown =
      this.cooldowns.get(
        cooldownKey
      ) ?? 0

    if (now < cooldown) {
      return
    }

    this.cooldowns.set(
      cooldownKey,
      now + 1000
    )

    match.state.selectedBooster =
      command.payload

    match.transition(
      MatchPhase.BOOSTER_RESOLUTION
    )
  }

  private buildCommandKey(
    command: GameCommand
  ): string {
    return [
      command.type,

      command.matchId,

      command.playerId,

      JSON.stringify(
        command.payload
      ),
    ].join(":")
  }

  private cleanup() {
    if (
      this.processedKeys.size >
      10000
    ) {
      this.processedKeys.clear()
    }
  }
}