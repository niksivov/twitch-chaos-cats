import { CommandProcessor } from "./core/CommandProcessor"

import { GameLoop } from "./core/GameLoop"

import { MatchManager } from "./core/MatchManager"

import { SessionManager } from "./core/SessionManager"

import { GameBroadcaster } from "./network/GameBroadcaster"

import { GameWebSocketServer } from "./network/WebSocketServer"

const sessionManager =
  new SessionManager()

const matchManager =
  new MatchManager(
    sessionManager
  )

const commandProcessor =
  new CommandProcessor(
    matchManager
  )

const websocketServer =
  new GameWebSocketServer(8080)

const broadcaster =
  new GameBroadcaster(
    websocketServer
  )

const gameLoop =
  new GameLoop(
    matchManager,
    commandProcessor,
    broadcaster
  )

const match =
  matchManager.createMatch()

console.log(
  "MATCH ID:",
  match.id
)

commandProcessor.enqueue({
  type: "JOIN",

  matchId: match.id,

  playerId: "player_1",

  payload: {
    nickname: "catViewer",
  },

  createdAt: Date.now(),
})

console.log(
  "PLAYERS AFTER ENQUEUE:",
  match.players
)

setTimeout(() => {
  console.log(
    "PLAYERS AFTER PROCESS:",
    match.players
  )
}, 3000)

gameLoop.start()

console.log("server started")

console.log(
  "websocket running on :8080"
)