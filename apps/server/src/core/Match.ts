import { MatchState } from "../models/MatchState"

import { createInitialMatchState } from "./createInitialMatchState"

export class Match {
  public state: MatchState

  public seed: number

  public createdAt: number

  constructor(
    roomId: string,
    seed: number
  ) {
    this.seed = seed

    this.createdAt =
      Date.now()

    this.state =
      createInitialMatchState(
        roomId
      )
  }
}