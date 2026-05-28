import { players } from "./players"

/**
 * Состояние игры
 */
export type GameState =
  | "WAITING"
  | "PLAYING"
  | "WINNER"

/**
 * Сколько очков нужно для победы
 */
export const SCORE_LIMIT = 10

/**
 * Текущее состояние игры
 */
let gameState: GameState = "WAITING"

/**
 * Победитель
 */
let winnerNickname = ""

/**
 * Получить game state
 */
export function getGameState() {
  return gameState
}

/**
 * Получить победителя
 */
export function getWinnerNickname() {
  return winnerNickname
}

/**
 * Начать игру
 */
export function startGame() {
  if (players.size < 2) {
    return
  }

  gameState = "PLAYING"

  console.log("GAME STARTED")
}

/**
 * Проверка победителя
 */
export function checkWinner() {
  const allPlayers = Array.from(players.values())

  const winner = allPlayers.find(
    (player) => player.score >= SCORE_LIMIT
  )

  if (!winner) {
    return false
  }

  winnerNickname = winner.nickname

  gameState = "WINNER"

  console.log(`WINNER: ${winner.nickname}`)

  return true
}

/**
 * Новый раунд
 */
export function resetGame() {
  players.clear()

  winnerNickname = ""

  gameState = "WAITING"

  console.log("NEW ROUND")
}