import { CommandProcessor } from "./core/CommandProcessor"
import { GameLoop } from "./core/GameLoop"
import { MatchManager } from "./core/MatchManager"
import { SessionManager } from "./core/SessionManager"
import { GameBroadcaster } from "./network/GameBroadcaster"
import { GameWebSocketServer } from "./network/WebSocketServer"

// ======== Создаём менеджеры ========
const sessionManager = new SessionManager()
const matchManager = new MatchManager(sessionManager)
const commandProcessor = new CommandProcessor(matchManager)
const websocketServer = new GameWebSocketServer(8080, matchManager, commandProcessor)
const broadcaster = new GameBroadcaster(websocketServer)
const gameLoop = new GameLoop(matchManager, commandProcessor, broadcaster)

// ======== Запускаем игровой цикл ========
gameLoop.start()

console.log("server started")
console.log("websocket running on :8080")

// 🔹 Матч и игроки теперь создаются через фронтенд командой CREATE_MATCH