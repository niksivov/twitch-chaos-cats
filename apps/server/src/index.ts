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

// ======== Создаём менеджеры ========
const sessionManager = new SessionManager()
const matchManager = new MatchManager()
const commandProcessor = new CommandProcessor(matchManager)

// ======== Список доступных аватаров ========
const availableAvatars = [
  "cat1",
  "cat2",
  "cat3",
  "cat4",
  "cat5",
  "cat6",
  "cat7",
  "cat8",
  "cat9",
  "cat10",
  "cat11",
  "cat12",
  "cat13",
  "cat14",
  "cat15",
  "cat16",
  "cat17",
]

// ======== Создаём лобби для регистрации игроков ========
const registrationLobby = new RegistrationLobby(
  availableAvatars.length
)

const websocketServer = new WebSocketServer(
  8080,
  matchManager,
  commandProcessor,
  registrationLobby
)

const broadcaster = new GameBroadcaster(
  websocketServer
)

// 🔹 ВАЖНО: один общий TurnManager для всей системы
const turnManager = new TurnManager()

const gameLoop = new GameLoop(
  matchManager,
  broadcaster
)

// 🔹 привязываем тот же TurnManager к GameLoop (чтобы не было рассинхрона)
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

// ======== Функция для старта Twitch-бота ========
export function startTwitchBot(channel: string) {
  twitchChannel = channel
  twitchBot.start(channel)
}

// ======== ОБНОВЛЁННАЯ функция создания матча ========
// теперь принимает либо число (старый формат), либо объект (новый формат)
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

  const maxPlayers =
    typeof input === "number"
      ? input
      : input.maxPlayers ?? 10

  const match = matchManager.createMatch({
    twitchChannel,
    maxPlayers,
    turnTimeSeconds: typeof input === "object" ? input.turnTimeSeconds : undefined,
    targetPoints: typeof input === "object" ? input.targetPoints : undefined,
    boosterSetSize: typeof input === "object" ? input.boosterSetSize : undefined,

  })

  // 🔹 временно открываем регистрацию, чтобы добавить игроков из лобби
  match.state.registrationOpen = true

  registrationLobby.getPlayers().forEach((p) => {
    match.addTwitchPlayer(
      p.twitchUserId,
      p.username,
      p.avatarId
    )
  })

  // 🔹 закрываем регистрацию после переноса
  match.state.registrationOpen = false

  // 🔹 Матч больше НЕ запускается отсюда.
  // Запуском FSM занимается исключительно GameLoop.

  // Очищаем лобби после старта
  registrationLobby.clear()

  return match
}

// ======== Игровой цикл ========
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

// ======== Запуск игрового цикла ========
gameLoop.start()

console.log("server started")
console.log("websocket running on :8080")