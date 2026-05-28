import { getAlivePlayers } from "./utils/getAlivePlayers"

import { EventLog } from "../events/EventLog"

interface BoosterExecutionContext {
  match: any

  sourcePlayerId: string
}

export interface Booster {
  id: string

  name: string

  execute(
    context: BoosterExecutionContext
  ): void
}

interface BoosterPoolEntry {
  booster: Booster

  copies: number
}

const eventLog =
  new EventLog()

const randomEliminationBooster: Booster =
  {
    id: "random_elimination",

    name: "Random Elimination",

    execute(context) {
      const alivePlayers =
        getAlivePlayers(
          context.match
        )

      if (
        alivePlayers.length === 0
      ) {
        return
      }

      const target =
        alivePlayers[
          Math.floor(
            Math.random() *
              alivePlayers.length
          )
        ]

      target.eliminated = true

      eventLog.add(
        context.match,
        `${target.nickname} was eliminated`
      )
    },
  }

const selfDestructBooster: Booster =
  {
    id: "self_destruct",

    name: "Self Destruct",

    execute(context) {
      const player =
        context.match.state.playersById[
          context.sourcePlayerId
        ]

      if (!player) {
        return
      }

      player.eliminated = true

      eventLog.add(
        context.match,
        `${player.nickname} self destructed`
      )
    },
  }

export class BoosterRegistry {
  private boosterPool: BoosterPoolEntry[] =
    [
      {
        booster:
          randomEliminationBooster,

        copies: 5,
      },

      {
        booster:
          selfDestructBooster,

        copies: 1,
      },
    ]

  getRandom(): Booster {
    const expandedPool: Booster[] =
      []

    for (const entry of this
      .boosterPool) {
      for (
        let i = 0;
        i < entry.copies;
        i++
      ) {
        expandedPool.push(
          entry.booster
        )
      }
    }

    return expandedPool[
      Math.floor(
        Math.random() *
          expandedPool.length
      )
    ]
  }

  getById(
    boosterId: string
  ): Booster | undefined {
    const expandedPool: Booster[] =
      []

    for (const entry of this
      .boosterPool) {
      expandedPool.push(
        entry.booster
      )
    }

    return expandedPool.find(
      (booster) => {
        return (
          booster.id === boosterId
        )
      }
    )
  }
}