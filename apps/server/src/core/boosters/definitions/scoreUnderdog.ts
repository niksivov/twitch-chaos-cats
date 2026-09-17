import { BoosterDefinition } from "../BoosterTypes"

export const scoreUnderdog: BoosterDefinition = {
  id: "SCORE_UNDERDOG",

  name: "+15 за каждого, у кого > очков",

  description:
    "Вы получаете +15 очков за каждого игрока, у которого больше очков, чем у Вас",

  nameEn: "+15 for each player with more points",

  descriptionEn:
    "You get +15 points for each player who has more points than you",

  poolCount: 2,

  icon: "scoreUnderdog",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    const player =
      match.state.registeredPlayers[sourcePlayerId]

    if (!player) {
      return
    }

    const strongerPlayers =
      match
        .getAlivePlayers()
        .filter(
          p =>
            p.playerId !== sourcePlayerId &&
            p.score > player.score
        )

    player.score +=
      strongerPlayers.length * 15
  },
}