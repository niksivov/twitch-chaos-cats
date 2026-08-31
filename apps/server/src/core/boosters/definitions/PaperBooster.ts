import { BoosterDefinition } from "../BoosterTypes"
import type { Match } from "../../Match"

function checkRpsWin(match: Match, playerId: string) {
  const collected =
    match.state.playerRpsCollection[playerId] ?? []

  if (collected.length < 3) return

  for (const player of match.getAlivePlayers()) {
    if (player.playerId !== playerId) {
      player.isAlive = false
    }
  }
}

export const PaperBooster: BoosterDefinition = {
  id: "PAPER",

  name: "Камень + Ножницы + Бумага = Победа",

  description:
    "Бумага оборачивает камень. Собери все три для победы!",

  poolCount: 1,

  icon: "paper",

  execute: ({ match, sourcePlayerId }) => {
    const collected =
      match.state.playerRpsCollection[
        sourcePlayerId
      ] ?? []

    if (!collected.includes("PAPER")) {
      collected.push("PAPER")
      match.state.playerRpsCollection[
        sourcePlayerId
      ] = collected
    }

    checkRpsWin(match, sourcePlayerId)
  },
}
