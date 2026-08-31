import { randomUUID } from "crypto"
import { Match, MatchPlayer } from "./Match"
import { MatchSettings } from "../models/MatchSettings"

export class MatchManager {
  private matches = new Map<string, Match>()

  private twitchBotService: any = null

  constructor() {}

  public setTwitchBotService(service: any) {
    this.twitchBotService = service
  }

  createMatch(settings: Partial<MatchSettings> & { twitchChannel: string; maxPlayers: number }): Match {
    const matchId = randomUUID()
    const match = new Match(matchId, settings)
    match.state.twitchChannel = settings.twitchChannel
    match.state.maxPlayers = settings.maxPlayers
    match.state.turnTimeSeconds = settings.turnTimeSeconds ?? 30
    match.state.targetPoints = settings.targetPoints ?? 10
    match.state.boosterSetSize = settings.boosterSetSize ?? 3
    match.state.registrationOpen = true
    this.matches.set(matchId, match)

    if (this.twitchBotService?.setCurrentMatch) {
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

  registerTwitchPlayer(matchId: string, twitchUserId: string, username: string, avatarId: string): MatchPlayer | null {
    const match = this.matches.get(matchId)
    if (!match) return null
    return match.addTwitchPlayer(twitchUserId, username, avatarId)
  }

  removePlayer(matchId: string, twitchUserId: string): void {
    const match = this.matches.get(matchId)
    if (!match) return
    match.eliminatePlayer(twitchUserId)
  }

  cleanupEmptyMatches(): void {
    for (const [matchId, match] of this.matches) {
      if (Object.keys(match.state.registeredPlayers).length === 0 && match.phase === "WAITING_FOR_PLAYERS") {
        this.removeMatch(matchId)
      }
    }
  }

  resetMatch(matchId: string): void {
    const match = this.matches.get(matchId)
    if (!match) return
    match.reset()
  }
}
