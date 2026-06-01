import { Match } from "../Match"

import { BoosterRegistry } from "./BoosterRegistry"

import { BoosterSetManager } from "./BoosterSetManager"

import { EventLog } from "../events/EventLog"

import { EffectEngine } from "../effects/EffectEngine"

export class BoosterEngine {
  private boosterRegistry =
    new BoosterRegistry()

  private boosterSetManager =
    new BoosterSetManager()

  private eventLog =
    new EventLog()

  private effectEngine =
    new EffectEngine()

  initialize(match: Match) {
    this.boosterSetManager.initialize(
      match
    )
  }

  activateBooster(
    match: Match,

    sourcePlayerId: string,

    slot: number
  ) {
    const setItem =
      match.state.boosterSet.find(
        (item) => {
          return (
            item.slot === slot
          )
        }
      )

    if (!setItem) {
      return
    }

    const booster =
      this.boosterRegistry.getById(
        setItem.boosterId
      )

    if (!booster) {
      return
    }

    const player =
      match.state.playersById[
        sourcePlayerId
      ]

    if (!player) {
      return
    }

    booster.execute({
      match,

      sourcePlayerId,
    })

    this.applyEffects(
      match,

      sourcePlayerId
    )

    this.eventLog.add(
      match,
      `${player.username} активирует ${booster.name}`
    )

    this.boosterSetManager.removeSlot(
      match,
      slot
    )

    match.state.selectedBooster =
      {
        boosterId:
          booster.id,

        sourcePlayerId,

        slot,

        activatedAt:
          Date.now(),
      }
  }

  private applyEffects(
    match: Match,

    playerId: string
  ) {
    const effects =
      this.effectEngine.getPlayerEffects(
        match,

        playerId
      )

    for (const effect of effects) {
      switch (
        effect.type
      ) {
        case "DOUBLE_POINTS":
          this.applyDoublePoints(
            match,

            playerId
          )
          break
      }
    }
  }

  private applyDoublePoints(
    match: Match,

    playerId: string
  ) {
    const player =
      match.state.playersById[
        playerId
      ]

    if (!player) {
      return
    }

    player.score *= 2
  }
}