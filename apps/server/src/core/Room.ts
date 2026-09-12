import { RegistrationLobby } from "./RegistrationLobby"

export class Room {
  public channel: string
  public lobby: RegistrationLobby
  public matchId: string | null = null
  public boosterPoolConfig: Record<string, number> = {}
  public pendingBoosterConfig: Record<string, number> = {}

  constructor(channel: string, maxPlayers: number) {
    this.channel = channel
    this.lobby = new RegistrationLobby(maxPlayers)
  }
}
