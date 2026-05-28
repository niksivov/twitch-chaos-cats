export class AntiSpamService {
  private lastCommandAtByPlayer =
    new Map<string, number>()

  private cooldownMs = 1500

  canExecute(
    playerId: string
  ): boolean {
    const now = Date.now()

    const lastCommandAt =
      this.lastCommandAtByPlayer.get(
        playerId
      )

    if (!lastCommandAt) {
      this.lastCommandAtByPlayer.set(
        playerId,
        now
      )

      return true
    }

    const diff =
      now - lastCommandAt

    if (diff < this.cooldownMs) {
      return false
    }

    this.lastCommandAtByPlayer.set(
      playerId,
      now
    )

    return true
  }
}