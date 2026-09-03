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
import { TurnManager } from "./core/TurnManager"
import { Room } from "./core/Room"

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080

// ======== HTTP SERVER ========
const app = express()

const clientPath = path.join(__dirname, "client")
app.use(express.static(clientPath))

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

// ======== Комнаты (channel → Room) ========
const rooms = new Map<string, Room>()

function getOrCreateRoom(channel: string): Room {
  let room = rooms.get(channel)
  if (!room) {
    room = new Room(channel, availableAvatars.length)
    rooms.set(channel, room)
  }
  return room
}

// ======== WEBSOCKET ========
const websocketServer = new WebSocketServer(
  httpServer,
  matchManager,
  commandProcessor,
  rooms,
  getOrCreateRoom
)

const broadcaster = new GameBroadcaster(websocketServer)

const turnManager = new TurnManager()
const gameLoop = new GameLoop(matchManager, broadcaster)
;(gameLoop as any).turnManager = turnManager

// ======== Очередь команд ========
const commandQueue = new CommandQueue()

// ======== Twitch-боты (channel → TwitchBotService) ========
const twitchBots = new Map<string, TwitchBotService>()

function startTwitchBot(channel: string) {
  if (twitchBots.has(channel)) return

  const room = getOrCreateRoom(channel)

  const bot = new TwitchBotService(
    room,
    matchManager,
    gameLoop,
    commandProcessor,
    availableAvatars,
    websocketServer,
    channel,
    () => {
      twitchBots.delete(channel)
      rooms.delete(channel)
      websocketServer.broadcastLobbyState(channel)
    }
  )

  twitchBots.set(channel, bot)
  bot.start(channel)
}

function stopTwitchBot(channel: string) {
  const bot = twitchBots.get(channel)
  if (bot) {
    bot.stop()
    twitchBots.delete(channel)
  }
  rooms.delete(channel)
}

function createMatchFromLobby(
  channel: string,
  input: {
    maxPlayers?: number
    turnTimeSeconds?: number
    targetPoints?: number
    boosterSetSize?: number
  }
) {
  const room = getOrCreateRoom(channel)

  const maxPlayersRaw = input.maxPlayers
  const maxPlayersNum = Math.floor(Number(maxPlayersRaw))
  const maxPlayers = Math.min(
    20,
    Math.max(2, Number.isFinite(maxPlayersNum) ? maxPlayersNum : 10)
  )

  const match = matchManager.createMatch({
    twitchChannel: channel,
    maxPlayers,
    turnTimeSeconds: input.turnTimeSeconds,
    targetPoints: input.targetPoints,
    boosterSetSize: input.boosterSetSize,
  })

  room.matchId = match.id
  match.state.registrationOpen = true

  room.lobby.getPlayers().forEach((p) => {
    match.addTwitchPlayer(p.twitchUserId, p.username, p.avatarId)
  })

  match.state.registrationOpen = false
  room.lobby.clear()

  return match
}

// ======== Экспорты для WebSocketServer ========
export { startTwitchBot, stopTwitchBot, createMatchFromLobby, rooms, getOrCreateRoom }

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
