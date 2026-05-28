import { CommandProcessor } from "./core/CommandProcessor"
import { CommandQueue } from "./core/CommandQueue"
import { GameLoop } from "./core/GameLoop"
import { MatchManager } from "./core/MatchManager"
import { PlayerManager } from "./core/PlayerManager"

import { GameBroadcaster } from "./network/GameBroadcaster"
import { GameWebSocketServer } from "./network/WebSocketServer"

const matchManager = new MatchManager()

const playerManager = new PlayerManager()

const commandQueue = new CommandQueue()

const commandProcessor = new CommandProcessor(
  matchManager,
  playerManager,
  commandQueue
)

const websocketServer =
  new GameWebSocketServer(8080)

const broadcaster = new GameBroadcaster(
  websocketServer
)

const gameLoop = new GameLoop(
  matchManager,
  commandProcessor,
  broadcaster
)

const match = matchManager.createMatch("room_test")

commandQueue.enqueue({
  roomId: match.state.roomId,

  playerId: "player_1",

  nickname: "catViewer",

  command: "!join",

  createdAt: Date.now(),
})

gameLoop.start()

console.log("server started")
console.log("websocket running on :8080")