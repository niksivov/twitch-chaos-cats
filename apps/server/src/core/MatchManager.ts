import { randomUUID } from "crypto"
import { Match, MatchPlayer } from "./Match"
import { MatchSettings } from "../models/MatchSettings"

export class MatchManager {
  private matches = new Map<string, Match>()

  // 🔹 NEW: ссылка на TwitchBotService (опционально)
  private twitchBotService: any = null

  constructor() {}

  // 🔹 NEW: подключение TwitchBotService (минимальный безопасный хук)
  public setTwitchBotService(service: any) {
    this.twitchBotService = service
  }

  // Создать новый матч с настройками Twitch
  createMatch(settings: Partial<MatchSettings> & { twitchChannel: string; maxPlayers: number }): Match {
    console.log("CREATE MATCH SETTINGS:", settings)
    const matchId = randomUUID()
    const match = new Match(matchId, settings)
    console.log('[1] AFTER NEW MATCH:', match.state)
    console.log('[1] STATE AFTER NEW MATCH:', match.state)
    match.state.twitchChannel = settings.twitchChannel
    match.state.maxPlayers = settings.maxPlayers
    match.state.turnTimeSeconds = settings.turnTimeSeconds ?? 30
    match.state.targetPoints = settings.targetPoints ?? 10
    match.state.boosterSetSize = settings.boosterSetSize ?? 3
    match.state.registrationOpen = true
    this.matches.set(matchId, match)
    console.log('[2] BEFORE RETURNING MATCH:', match.state)

    // 🔹 NEW: уведомление TwitchBotService сразу после создания матча
    if (this.twitchBotService?.setCurrentMatch) {
      console.log("[MATCH MANAGER] notifying TwitchBotService:", matchId)
      this.twitchBotService.setCurrentMatch(matchId)
    }

    return match
  }

  getMatch(matchId: string): Match | null {
    return this.matches.get(matchId) ?? null
  }

  getAllMatches(): Match[] {
    return Array.from(this.matches.values())
  }

  removeMatch(matchId: string): void {
    this.matches.delete(matchId)
  }

  // Регистрация Twitch-игрока через !join
  registerTwitchPlayer(matchId: string, twitchUserId: string, username: string, avatarId: string): MatchPlayer | null {
    const match = this.matches.get(matchId)
    if (!match) return null
    return match.addTwitchPlayer(twitchUserId, username, avatarId)
  }

  // Удаление игрока (например при выбывании)
  removePlayer(matchId: string, twitchUserId: string): void {
    const match = this.matches.get(matchId)
    if (!match) return
    match.eliminatePlayer(twitchUserId)
  }

  // Проверка, нужно ли удалить пустые матчи
  cleanupEmptyMatches(): void {
    for (const [matchId, match] of this.matches) {
      if (Object.keys(match.state.registeredPlayers).length === 0 && match.phase === "WAITING_FOR_PLAYERS") {
        this.removeMatch(matchId)
      }
    }
  }

  // Синхронизация состояния матча после сброса
  resetMatch(matchId: string): void {
    const match = this.matches.get(matchId)
    if (!match) return
    match.reset()
  }
}