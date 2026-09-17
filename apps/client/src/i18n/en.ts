import type { Dict } from "./ru"

export const en: Dict = {
  "app.title": "Twitch, Chaos and Cats",

  "channelSelect.subtitle": "Select a channel and max number of players",
  "channelSelect.twitchChannel": "Twitch channel",
  "channelSelect.maxPlayers": "Max players (2 to 20)",
  "channelSelect.next": "Next",

  "validation.maxPlayers": "Enter an integer from 2 to 20",
  "validation.turnTime": "Enter an integer from 5 to 600",
  "validation.targetPoints": "Enter an integer from 50",
  "validation.boosterSetSize": "Enter an integer from 1 to {max}",

  "settings.title": "Match settings",
  "settings.turnTime": "Turn timer (seconds, 5 to 600)",
  "settings.targetPoints": "Points to win (from 50)",
  "settings.boosterSetSize": "Boosters per set (1 to {max})",
  "settings.joinHint": "Type !join in chat to join. Registered players ({count}):",
  "settings.waitingForPlayers": "Waiting for players in chat...",
  "settings.play": "Play",
  "settings.howToPlay": "How to play",
  "settings.allBoosters": "{arrow} All boosters ({kinds} types, {pool} in pool)",
  "settings.saveHint": "!save = save settings, !default = restore default settings",
  "settings.tableName": "Name",
  "settings.tableDescription": "Description",
  "settings.tablePool": "Pool",

  "game.howToPlay": "How to play",
  "game.waitingForMatch": "Waiting for match...",
  "game.round": "Round {round}",
  "game.resetHintBefore": "Streamer command",
  "game.resetHintAfter": "will reset the current game",
  "game.statusSaved": "Saved",
  "game.statusReset": "Restored to default",

  "howToPlay.title": "How to play?",

  "boosterSet.header": "Boosters (on your turn activate one booster with the command !boosterNumber, to skip the turn type !0)",
  "boosterSet.empty": "No boosters yet",

  "eventLog.title": "Events",
  "eventLog.empty": "No events yet",
  "eventLog.boosterActivated": "⚡ {player} activates {booster}",
  "eventLog.roundStart": "🎯 Round {round} started",
  "eventLog.winner": "🏆 Winner: {winner}",

  "result.winner": "🏆 Winner!",
  "result.byPoints": "Win by points",
  "result.finalRanking": "Final ranking",
  "result.playAgain": "🎮 Play again",

  "pandora.chaos": "CHAOS!",

  "turnTimer.playerTurn": "Player's turn",
  "turnTimer.waiting": "Waiting...",

  "wheel.title": "🎰 Wheel of Fortune!",
  "wheel.winner": "🏆 {winner} wins!",
}

export const enHowToPlay: { title: string; body: string }[] = [
  {
    title: "What is this",
    body: "«Twitch, Chaos and Cats» is a game played with the Twitch chat. There's no separate game to install: everything happens right in the chat and on the streamer's screen. You control your cat with chat commands.",
  },
  {
    title: "1. Join",
    body: "When the streamer opens registration, type !join in chat. You'll appear in the lobby with a random cat avatar. You can join until the required number of players is reached (2 to 20).",
  },
  {
    title: "2. Turns and rounds",
    body: "The game goes in rounds. In each round players take turns — from the weakest to the leader (whoever has fewer points moves first). When it's your turn, the screen highlights your cat and the turn timer starts.",
  },
  {
    title: "3. Boosters — the main action",
    body: "Each round all players are offered a shared set of boosters. To activate one, type its number in chat with the command !boosterNumber (for example !1). The effect triggers and changes the scores. If you didn't pick a booster before the timer ran out — the turn simply passes to the next player.",
  },
  {
    title: "4. How to win",
    body: "Be the first to reach the required number of points, or be the last surviving cat.",
  },
  {
    title: "Newbie tips",
    body: "Watch the timer and pick a booster fast. The turn order always starts from the weakest to the strongest — trailing players can catch up to leaders through chaotic boosters. Chaos is part of the game: read the event feed at the bottom of the screen.",
  },
  {
    title: "Booster settings (for the streamer)",
    body: "Before the match starts, on the settings screen in the «All boosters» section you can set how many boosters end up in the shared set (how many copies of each booster are in the pool).",
  },
]