import { Match } from "./Match"

export class MatchManager {
  private matches = new Map<string, Match>()

  createMatch(roomId: string) {
    const seed = Math.floor(Math.random() * 999999999)

    const match = new Match(roomId, seed)

    this.matches.set(roomId, match)

    return match
  }

  getMatch(roomId: string) {
    return this.matches.get(roomId)
  }

  getAllMatches() {
    return [...this.matches.values()]
  }

  removeMatch(roomId: string) {
    this.matches.delete(roomId)
  }
}