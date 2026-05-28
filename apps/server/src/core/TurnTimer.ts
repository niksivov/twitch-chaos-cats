export class TurnTimer {
  private remainingSeconds = 0

  private interval?: NodeJS.Timeout

  start(
    duration: number,
    onTick: (
      remainingSeconds: number
    ) => void,
    onFinish: () => void
  ) {
    this.stop()

    this.remainingSeconds = duration

    onTick(this.remainingSeconds)

    this.interval = setInterval(() => {
      this.remainingSeconds--

      onTick(this.remainingSeconds)

      if (
        this.remainingSeconds <= 0
      ) {
        this.stop()

        onFinish()
      }
    }, 1000)
  }

  stop() {
    if (!this.interval) {
      return
    }

    clearInterval(this.interval)

    this.interval = undefined
  }

  getRemainingSeconds() {
    return this.remainingSeconds
  }
}