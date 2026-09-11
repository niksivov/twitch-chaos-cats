import { BoosterDefinition } from "../BoosterTypes"

export const goodBadViewer: BoosterDefinition = {
  id: "GOOD_BAD_VIEWER",

  name: "Хороший зритель, плохой зритель",

  description:
    "Зритель (не участник игры) в течение матча может написать число от -100 до 100 в чат — Вы получаете последнее написанное",

  poolCount: 1,

  icon: "goodBadViewer",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    const player =
      match.state.registeredPlayers[
        sourcePlayerId
      ]

    if (!player) {
      return
    }

    const value =
      match.state.lastViewerNumber

    player.score +=
      value !== null
        ? value
        : 0
  },
}