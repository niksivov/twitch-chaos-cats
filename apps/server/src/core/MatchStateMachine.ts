import { MatchPhase } from "./matchPhase"

const transitions: Record<
  MatchPhase,
  MatchPhase[]
> = {
  [MatchPhase.WAITING_FOR_PLAYERS]: [
    MatchPhase.ROUND_START,
  ],

  [MatchPhase.ROUND_START]: [
    MatchPhase.TURN_START,
  ],

  [MatchPhase.TURN_START]: [
    MatchPhase.BOOSTER_SELECTION,
  ],

  [MatchPhase.BOOSTER_SELECTION]: [
    MatchPhase.BOOSTER_RESOLUTION,
  ],

  [MatchPhase.BOOSTER_RESOLUTION]: [
    MatchPhase.TURN_END,
  ],

  [MatchPhase.TURN_END]: [
    MatchPhase.TURN_START,
    MatchPhase.ROUND_END,
    MatchPhase.MATCH_END, // мгновенная победа по очкам или выбыванию
  ],

  [MatchPhase.ROUND_END]: [
    MatchPhase.ROUND_START,
    MatchPhase.MATCH_END,
  ],

  [MatchPhase.MATCH_END]: [
    MatchPhase.RESETTING,
  ],

  [MatchPhase.RESETTING]: [
    MatchPhase.WAITING_FOR_PLAYERS,
  ],
}

export class MatchStateMachine {
  private phase: MatchPhase

  constructor(initialPhase: MatchPhase) {
    this.phase = initialPhase
  }

  public getPhase(): MatchPhase {
    return this.phase
  }

  public canTransition(
    next: MatchPhase,
  ): boolean {
    return transitions[this.phase].includes(
      next,
    )
  }

  public transition(
    next: MatchPhase,
  ): void {
    if (!this.canTransition(next)) {
      throw new Error(
        `Invalid transition: ${this.phase} -> ${next}`,
      )
    }

    this.phase = next
  }
}