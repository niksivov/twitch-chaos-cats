import tmi from "tmi.js"

import { addPlayer, players } from "./players"

/**
 * Callback обновления игроков
 */
let playersUpdateCallback: (() => void) | null = null

/**
 * Backend сможет передать сюда функцию обновления
 */
export function setPlayersUpdateCallback(callback: () => void) {
  playersUpdateCallback = callback
}

/**
 * Twitch IRC client
 */
export const twitchClient = new tmi.Client({
  connection: {
    reconnect: true
  },

  channels: []
})

/**
 * Подключение к Twitch каналу
 */
export async function connectToChannel(channel: string) {
  try {
    await twitchClient.connect()

    await twitchClient.join(channel)

    console.log(`TWITCH CONNECTED: ${channel}`)

  } catch (error) {
    console.log("TWITCH CONNECTION ERROR:", error)
  }
}

/**
 * Обработка сообщений Twitch чата
 */
twitchClient.on("message", (_channel, tags, message) => {
  /**
   * Команда входа в игру
   */
  if (message.toLowerCase() === "!play") {
    const username = tags.username

    if (!username) return

    /**
     * Проверяем, есть ли уже игрок
     */
    const alreadyExists = Array.from(players.values()).some(
      (player) => player.nickname === username
    )

    if (alreadyExists) {
      console.log(`${username} already in game`)
      return
    }

    /**
     * Добавляем игрока
     */
    addPlayer(username, username)

    console.log(`TWITCH PLAYER JOINED: ${username}`)

    /**
     * Обновляем frontend
     */
    if (playersUpdateCallback) {
      playersUpdateCallback()
    }
  }
})