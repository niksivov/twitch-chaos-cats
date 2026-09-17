import { BoosterDefinition } from "../BoosterTypes"

export const instantwin3percent: BoosterDefinition = {
  id: "INSTANT_WIN_ELIMINATION",

  name: "Мгновенная победа (3%)",

  description: "С вероятностью 3% Вы сразу побеждаете в этой игре",

  nameEn: "Instant win (3%)",

  descriptionEn: "With a 3% chance you instantly win this game",

  poolCount: 2,

  icon: "instantwin3percent",

  execute: ({ match, sourcePlayerId }) => {
    const roll = Math.random()
    if (roll < 0.03) {
      for (const player of match.getAlivePlayers()) {
        if (player.playerId !== sourcePlayerId) {
          player.isAlive = false
        }
      }
    }
  },
}