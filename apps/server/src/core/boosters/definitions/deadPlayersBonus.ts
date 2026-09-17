import { BoosterDefinition } from "../BoosterTypes"

export const deadPlayersBonus: BoosterDefinition = {
  id: "DEAD_PLAYERS_BONUS_75",

  name: "+75 за умершего",

  description:
    "Вы получаете +75 очков за КАЖДОГО умершего игрока",

  nameEn: "+75 for the dead",

  descriptionEn:
    "You get +75 points for EACH dead player",

  poolCount: 1,

  icon: "deadBonus",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) return

    const allPlayers = Object.values(
      match.state.registeredPlayers
    )

    const deadCount = allPlayers.filter(
      p => !p.isAlive
    ).length

    player.score += deadCount * 75
  },
}