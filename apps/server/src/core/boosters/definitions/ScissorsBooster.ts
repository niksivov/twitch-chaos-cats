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

export const ScissorsBooster: BoosterDefinition = {
  id: "SCISSORS",

  name: "Ножницы",

  description:
    "Соберите Камень, Ножницы и Бумагу для мгновенной победы!",

  poolCount: 1,

  icon: "scissors",

  execute: ({ match, sourcePlayerId }) => {
    const collected =
      match.state.playerRpsCollection[
        sourcePlayerId
      ] ?? []

    if (!collected.includes("SCISSORS")) {
      collected.push("SCISSORS")
      match.state.playerRpsCollection[
        sourcePlayerId
      ] = collected
    }

    checkRpsWin(match, sourcePlayerId)
  },
}
