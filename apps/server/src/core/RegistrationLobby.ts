// core/RegistrationLobby.ts

export interface RegisteredPlayer {
  twitchUserId: string
  username: string
  avatarId: string
}

export class RegistrationLobby {
  private players = new Map<string, RegisteredPlayer>()
  private maxPlayers: number
  private channel: string | null = null

  constructor(maxPlayers?: number) {
    this.maxPlayers = maxPlayers ?? Infinity
  }

  // 🆕 старт лобби (канал Twitch)
  start(channel: string) {
    this.channel = channel
    console.log(`[Lobby] started for channel: ${channel}`)
  }

  // Добавить игрока в лобби
  addPlayer(player: RegisteredPlayer): boolean {
    if (this.players.size >= this.maxPlayers) return false
    this.players.set(player.twitchUserId, player)
    return true
  }

  // Получить всех зарегистрированных игроков
  getPlayers(): RegisteredPlayer[] {
    return Array.from(this.players.values())
  }

  // Проверка, зарегистрирован ли игрок
  hasPlayer(twitchUserId: string): boolean {
    return this.players.has(twitchUserId)
  }

  // Проверка, есть ли свободные слоты
  hasSpace(): boolean {
    return this.players.size < this.maxPlayers
  }

  // Очистка лобби после старта матча
  clear() {
    this.players.clear()
  }

  // Удаление конкретного игрока (например, при вылете)
  removePlayer(twitchUserId: string) {
    this.players.delete(twitchUserId)
  }

  // Получить количество зарегистрированных игроков
  count(): number {
    return this.players.size
  }
}