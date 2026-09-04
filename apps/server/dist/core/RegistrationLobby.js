"use strict";
// core/RegistrationLobby.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationLobby = void 0;
class RegistrationLobby {
    constructor(maxPlayers) {
        this.players = new Map();
        this.channel = null;
        this.maxPlayers = maxPlayers ?? Infinity;
    }
    // 🆕 старт лобби (канал Twitch)
    start(channel) {
        this.channel = channel;
        console.log(`[Lobby] started for channel: ${channel}`);
    }
    // Добавить игрока в лобби
    addPlayer(player) {
        if (this.players.size >= this.maxPlayers)
            return false;
        this.players.set(player.twitchUserId, player);
        return true;
    }
    // Получить всех зарегистрированных игроков
    getPlayers() {
        return Array.from(this.players.values());
    }
    // Проверка, зарегистрирован ли игрок
    hasPlayer(twitchUserId) {
        return this.players.has(twitchUserId);
    }
    // Проверка, есть ли свободные слоты
    hasSpace() {
        return this.players.size < this.maxPlayers;
    }
    // Очистка лобби после старта матча
    clear() {
        this.players.clear();
    }
    // Удаление конкретного игрока (например, при вылете)
    removePlayer(twitchUserId) {
        this.players.delete(twitchUserId);
    }
    // Получить количество зарегистрированных игроков
    count() {
        return this.players.size;
    }
}
exports.RegistrationLobby = RegistrationLobby;
