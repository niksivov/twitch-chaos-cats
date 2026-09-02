import { BoosterDefinition } from "../BoosterTypes"
import type { Match } from "../../Match"

const RPS_TYPES = ["ROCK", "SCISSORS", "PAPER"]

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

export const RockBooster: BoosterDefinition = {
  id: "ROCK",

  name: "Камень",

  description:
    "Соберите Камень, Ножницы и Бумагу для мгновенной победы!",

  poolCount: 1,

  icon: "rock",

  execute: ({ match, sourcePlayerId }) => {
    const collected =
      match.state.playerRpsCollection[
        sourcePlayerId
      ] ?? []

    if (!collected.includes("ROCK")) {
      collected.push("ROCK")
      match.state.playerRpsCollection[
        sourcePlayerId
      ] = collected
    }

    checkRpsWin(match, sourcePlayerId)
  },
}
