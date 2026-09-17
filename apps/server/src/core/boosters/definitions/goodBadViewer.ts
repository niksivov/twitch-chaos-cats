import { BoosterDefinition } from "../BoosterTypes"

export const goodBadViewer: BoosterDefinition = {
  id: "GOOD_BAD_VIEWER",

  name: "Хороший зритель, плохой зритель",

  description:
    "Зритель (не участник игры) в течение матча может написать число от -100 до 100 в чат — Вы получаете последнее написанное",

  nameEn: "Good viewer, bad viewer",

  descriptionEn:
    "A viewer (not a game participant) can write a number from -100 to 100 in chat during the match — you get the last number written",

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