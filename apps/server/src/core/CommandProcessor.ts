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
      console.log("[CommandProcessor] Command already processed, skipping:", key)
      return
    }

    this.processedKeys.add(key)
    console.log("[CommandProcessor] Enqueued command:", command)
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
      console.log("[CommandProcessor] Missing matchId, skipping command:", command)
      return
    }

    const match = this.matchManager.getMatch(command.matchId)

    if (!match) {
      console.log("[CommandProcessor] Match not found for id:", command.matchId)
      return
    }

    console.log("[CommandProcessor] Processing command:", command.type, "for match:", match.id)

    switch (command.type) {
      case "SELECT_BOOSTER":
        this.handleSelectBooster(match, command)
        break
      default:
        console.log("[CommandProcessor] Unknown command type:", command.type)
    }
  }

  private handleSelectBooster(match: any, command: GameCommand) {
    console.log("[BoostCommandHandler] Current match phase:", match.phase)
    
    if (match.phase !== MatchPhase.BOOSTER_SELECTION) {
      console.log("[BoostCommandHandler] Not in BOOSTER_SELECTION phase, stopping.")
      return
    }

    if (match.state.turnResolvedAt !== null) {
      console.log("[BoostCommandHandler] Turn already resolved, stopping.")
      return
    }

    if (!command.playerId) {
      console.log("[BoostCommandHandler] Missing playerId, stopping.")
      return
    }

    console.log("[BoostCommandHandler] Current turn player:", match.currentPlayerId)
    console.log("[BoostCommandHandler] Command playerId:", command.playerId)

    if (command.playerId !== match.currentPlayerId) {
      console.log("[BoostCommandHandler] Not player's turn, stopping.")
      return
    }

    const cooldownKey = `${command.playerId}:SELECT_BOOSTER`
    const now = Date.now()
    const cooldown = this.cooldowns.get(cooldownKey) ?? 0

    console.log("[BoostCommandHandler] Cooldown check:", { now, cooldown })

    if (now < cooldown) {
      console.log("[BoostCommandHandler] Still on cooldown, stopping.")
      return
    }

    this.cooldowns.set(cooldownKey, now + 1000)

    const slot = command.payload?.slot

    if (typeof slot !== "number") {
      console.log("[BoostCommandHandler] Invalid slot value:", slot)
      return
    }

    console.log("[BoostCommandHandler] Activating booster for player", command.playerId, "slot", slot)

    match.state.turnResolvedAt = now
    this.boosterEngine.activateBooster(match, command.playerId, slot)

    match.transition(MatchPhase.BOOSTER_RESOLUTION)

    console.log("[BoostCommandHandler] Booster activated and phase transitioned to BOOSTER_RESOLUTION")
  }

  private buildCommandKey(command: GameCommand): string {
    return [
      command.type,
      command.matchId ?? "",
      command.playerId ?? "",
      JSON.stringify(command.payload),
    ].join(":")
  }

  private cleanup() {
    if (this.processedKeys.size > 10000) {
      console.log("[CommandProcessor] Clearing processedKeys set to avoid memory leak")
      this.processedKeys.clear()
    }
  }
}