import { MatchManager } from "./MatchManager"
import { MatchPhase } from "./matchPhase"
import { BoosterEngine } from "./boosters/BoosterEngine"

export interface GameCommand {
  type: string
  matchId?: string
  playerId?: string
  payload?: any
  createdAt: number
}

export class CommandProcessor {
  private queue: GameCommand[] = []

  private readonly processedKeys = new Set<string>()

  private readonly cooldowns = new Map<string, number>()

  private readonly boosterEngine = new BoosterEngine()

  constructor(
    private readonly matchManager: MatchManager
  ) {}

  enqueue(command: GameCommand) {
    const key = this.buildCommandKey(command)

    if (this.processedKeys.has(key)) {
      return
    }

    this.processedKeys.add(key)
    this.queue.push(command)
  }

  process() {
    const commands = [...this.queue]
    this.queue.length = 0

    for (const command of commands) {
      this.processCommand(command)
    }

    this.cleanup()
  }

  private processCommand(command: GameCommand) {
    if (!command.matchId) {
      return
    }

    const match = this.matchManager.getMatch(command.matchId)

    if (!match) {
      return
    }

    switch (command.type) {
      case "SELECT_BOOSTER":
        this.handleSelectBooster(match, command)
        break
    }
  }

  private handleSelectBooster(match: any, command: GameCommand) {
    if (match.phase !== MatchPhase.BOOSTER_SELECTION) {
      return
    }

    if (match.state.turnResolvedAt !== null) {
      return
    }

    if (!command.playerId) {
      return
    }

    if (command.playerId !== match.currentPlayerId) {
      return
    }

    const cooldownKey = `${command.playerId}:SELECT_BOOSTER`
    const now = Date.now()
    const cooldown = this.cooldowns.get(cooldownKey) ?? 0

    if (now < cooldown) {
      return
    }

    this.cooldowns.set(cooldownKey, now + 1000)

    const slot = command.payload?.slot

    if (typeof slot !== "number") {
      return
    }

    match.state.turnResolvedAt = now
    this.boosterEngine.activateBooster(match, command.playerId, slot)

    match.transition(MatchPhase.BOOSTER_RESOLUTION)
  }

private buildCommandKey(command: GameCommand): string {
  const match = command.matchId
    ? this.matchManager.getMatch(command.matchId)
    : null

  return [
    command.type,
    command.matchId ?? "",
    command.playerId ?? "",
    match?.round ?? 0,
    JSON.stringify(command.payload),
  ].join(":")
}

  private cleanup() {
    if (this.processedKeys.size > 10000) {
      this.processedKeys.clear()
    }
  }
}
