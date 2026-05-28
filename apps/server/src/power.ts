import { players } from "./players"

/**
 * Событие усилителя
 */
export interface PowerEvent {
  title: string
  description: string
}

/**
 * Усилитель
 */
interface Power {
  id: string

  title: string

  activate: () => PowerEvent | null
}

/**
 * Последнее событие
 */
let latestPowerEvent: PowerEvent | null = null

/**
 * Получить последнее событие
 */
export function getLatestPowerEvent() {
  return latestPowerEvent
}

/**
 * Lucky Cat
 * Случайный игрок получает +1 очко
 */
const luckyCatPower: Power = {

  id: "lucky_cat",

  title: "Lucky Cat",

  activate() {

    const allPlayers = Array.from(players.values())

    if (allPlayers.length === 0) {
      return null
    }

    const randomPlayer =
      allPlayers[
        Math.floor(Math.random() * allPlayers.length)
      ]

    randomPlayer.score += 1

    return {
      title: "⚡ Lucky Cat",
      description:
        `${randomPlayer.nickname} получает +1 очко`
    }
  }
}

/**
 * Все усилители
 */
const powers: Power[] = [
  luckyCatPower
]

/**
 * Случайный усилитель
 */
export function activateRandomPower() {

  if (powers.length === 0) {
    return
  }

  const randomPower =
    powers[
      Math.floor(Math.random() * powers.length)
    ]

  const result = randomPower.activate()

  if (!result) {
    return
  }

  latestPowerEvent = result

  console.log(
    `[POWER] ${result.title}: ${result.description}`
  )
}