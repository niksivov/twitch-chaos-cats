import express from "express"
import path from "path"

import { CommandProcessor } from "./core/CommandProcessor"
import { GameLoop } from "./core/GameLoop"
import { MatchManager } from "./core/MatchManager"
import { SessionManager } from "./core/SessionManager"
import { GameBroadcaster } from "./network/GameBroadcaster"
import { WebSocketServer } from "./network/WebSocketServer"
import { TwitchBotService } from "./network/TwitchBotService"
import { CommandQueue } from "./core/CommandQueue"
import { RegistrationLobby } from "./core/RegistrationLobby"
import { TurnManager } from "./core/TurnManager"

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080

// ======== HTTP SERVER (FIX FOR RENDER) ========
const app = express()

// ======== FIX: SERVE FRONTEND (VITE BUILD) ========
// ВАЖНО: Vite билд у тебя идёт в server/dist/client
const clientPath = path.join(__dirname, "client")

app.use(express.static(clientPath))

// SPA fallback (React Router / прямые урлы)
app.get("*", (_, res) => {
  res.sendFile(path.join(clientPath, "index.html"))
})

app.get("/health", (_, res) => {
  res.json({ ok: true })
})

const httpServer = app.listen(PORT, () => {
  console.log("HTTP server started on", PORT)
})

// ======== Создаём менеджеры ========
const sessionManager = new SessionManager()
const matchManager = new MatchManager()
const commandProcessor = new CommandProcessor(matchManager)

// ======== Список доступных аватаров ========
const availableAvatars = [
  "cat1","cat2","cat3","cat4","cat5","cat6","cat7","cat8","cat9",
  "cat10","cat11","cat12","cat13","cat14","cat15","cat16","cat17","cat18","cat19","cat20","cat21","cat22","cat23","cat24","cat25","cat26","cat27",
]

// ======== Создаём лобби для регистрации игроков ========
const registrationLobby = new RegistrationLobby(
  availableAvatars.length
)

// ======== WEBSOCKET (now attached to HTTP server) ========
const websocketServer = new WebSocketServer(
  httpServer,
  matchManager,
  commandProcessor,
  registrationLobby
)

const broadcaster = new GameBroadcaster(websocketServer)

// 🔹 ВАЖНО: один общий TurnManager для всей системы
const turnManager = new TurnManager()

const gameLoop = new GameLoop(matchManager, broadcaster)

// 🔹 привязываем тот же TurnManager к GameLoop
;(gameLoop as any).turnManager = turnManager

// ======== Создаём очередь команд ========
const commandQueue = new CommandQueue()

// ======== Канал Twitch ========
let twitchChannel: string | null = null

// ======== Создаём Twitch-бот ========
const twitchBot = new TwitchBotService(
  registrationLobby,
  matchManager,
  gameLoop,
  commandProcessor,
  availableAvatars,
  websocketServer
)

matchManager.setTwitchBotService(twitchBot)

// ======== Twitch start ========
export function startTwitchBot(channel: string) {
  twitchChannel = channel
  twitchBot.start(channel)
}

export function stopTwitchBot() {
  twitchBot.stop()
  twitchChannel = null
}

// ======== Создание матча ========
export function createMatchFromLobby(
  input: number | {
    maxPlayers?: number
    turnTimeSeconds?: number
    targetPoints?: number
    boosterSetSize?: number
  }
) {
  if (!twitchChannel) {
    throw new Error(
      "Twitch channel not set. Call startTwitchBot first."
    )
  }

  const maxPlayersRaw =
    typeof input === "number" ? input : input.maxPlayers
  const maxPlayersNum = Math.floor(Number(maxPlayersRaw))
  const maxPlayers = Math.min(
    20,
    Math.max(2, Number.isFinite(maxPlayersNum) ? maxPlayersNum : 10)
  )

  const match = matchManager.createMatch({
    twitchChannel,
    maxPlayers,
    turnTimeSeconds:
      typeof input === "object" ? input.turnTimeSeconds : undefined,
    targetPoints:
      typeof input === "object" ? input.targetPoints : undefined,
    boosterSetSize:
      typeof input === "object" ? input.boosterSetSize : undefined,
  })

  match.state.registrationOpen = true

  registrationLobby.getPlayers().forEach((p) => {
    match.addTwitchPlayer(p.twitchUserId, p.username, p.avatarId)
  })

  match.state.registrationOpen = false
  registrationLobby.clear()

  return match
}

// ======== Game loop ========
setInterval(() => {
  const commands = commandQueue.drain()

  for (const cmd of commands) {
    commandProcessor.enqueue({
      type: cmd.type,
      matchId: cmd.roomId,
      playerId: cmd.playerId,
      payload: cmd.payload,
      createdAt: cmd.createdAt,
    })
  }

  commandProcessor.process()
}, 100)

// ======== START ========
gameLoop.start()

console.log("server started")
console.log(`websocket running on :${PORT}`)