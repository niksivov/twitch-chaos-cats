import { RegistrationLobby } from "./RegistrationLobby"

export class Room {
  public channel: string
  public lobby: RegistrationLobby
  public matchId: string | null = null

  constructor(channel: string, maxPlayers: number) {
    this.channel = channel
    this.lobby = new RegistrationLobby(maxPlayers)
  }
}
