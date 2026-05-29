export interface BoosterContext {
  match: any

  sourcePlayerId: string
}

export interface BoosterDefinition {
  id: string

  name: string

  description: string

  rarity: number

  execute(
    context: BoosterContext
  ): void
}

export class BoosterRegistry {
  private boosters =
    new Map<
      string,
      BoosterDefinition
    >()

  constructor() {
    this.registerDefaults()
  }

  private registerDefaults() {
    this.register({
      id: "PLUS_20",

      name: "+20 Points",

      description:
        "Add 20 points to yourself",

      rarity: 1,

      execute: ({
        match,

        sourcePlayerId,
      }) => {
        const player =
          match.state.playersById[
            sourcePlayerId
          ]

        if (!player) {
          return
        }

        player.score += 20
      },
    })

    this.register({
      id: "PLUS_50",

      name: "+50 Points",

      description:
        "Add 50 points to yourself",

      rarity: 2,

      execute: ({
        match,

        sourcePlayerId,
      }) => {
        const player =
          match.state.playersById[
            sourcePlayerId
          ]

        if (!player) {
          return
        }

        player.score += 50
      },
    })

    this.register({
      id: "MINUS_30_RANDOM",

      name:
        "-30 Random Enemy",

      description:
        "Remove 30 points from random enemy",

      rarity: 2,

      execute: ({
        match,

        sourcePlayerId,
      }) => {
        const targets =
          match
            .getAlivePlayers()
            .filter(
              (
                player: any
              ) =>
                player.id !==
                sourcePlayerId
            )

        if (
          targets.length === 0
        ) {
          return
        }

        const randomTarget =
          targets[
            Math.floor(
              Math.random() *
                targets.length
            )
          ]

        randomTarget.score -= 30

        if (
          randomTarget.score < 0
        ) {
          randomTarget.score = 0
        }
      },
    })

    this.register({
      id: "RANDOM_REMOVE",

      name:
        "Random Elimination",

      description:
        "Remove random enemy from game",

      rarity: 5,

      execute: ({
        match,

        sourcePlayerId,
      }) => {
        const targets =
          match
            .getAlivePlayers()
            .filter(
              (
                player: any
              ) =>
                player.id !==
                sourcePlayerId
            )

        if (
          targets.length === 0
        ) {
          return
        }

        const randomTarget =
          targets[
            Math.floor(
              Math.random() *
                targets.length
            )
          ]

        randomTarget.isAlive =
          false
      },
    })

    this.register({
      id: "DOUBLE_SELF",

      name:
        "Double Points",

      description:
        "Double your current score",

      rarity: 4,

      execute: ({
        match,

        sourcePlayerId,
      }) => {
        const player =
          match.state.playersById[
            sourcePlayerId
          ]

        if (!player) {
          return
        }

        player.score =
          player.score * 2
      },
    })
  }

  register(
    booster: BoosterDefinition
  ) {
    this.boosters.set(
      booster.id,
      booster
    )
  }

  getAll(): BoosterDefinition[] {
    return [
      ...this.boosters.values(),
    ]
  }

  getById(
    id: string
  ):
    | BoosterDefinition
    | undefined {
    return this.boosters.get(id)
  }
}