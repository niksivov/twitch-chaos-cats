import {
  CommandQueue,
  QueuedCommand,
} from "./CommandQueue"

import { MatchManager } from "./MatchManager"

import { PlayerManager } from "./PlayerManager"

import { createGameEvent } from "./events/createGameEvent"

import { GameEventEmitter } from "./events/GameEventEmitter"

import { AntiSpamService } from "./antiSpam/AntiSpamService"

import { SessionManager } from "./sessions/SessionManager"

export class CommandProcessor {
  private antiSpamService =
    new AntiSpamService()

  private sessionManager =
    new SessionManager()

  private playerManager =
    new PlayerManager(
      this.sessionManager
    )

  constructor(
    private commandQueue: CommandQueue,

    private matchManager: MatchManager,

    private eventEmitter: GameEventEmitter
  ) {}

  process() {
    const commands =
      this.commandQueue.drain()

    for (const command of commands) {
      this.processCommand(command)
    }
  }

  private processCommand(
    command: QueuedCommand
  ) {
    const match =
      this.matchManager.getMatch(
        command.roomId
      )

    if (!match) {
      return
    }

    const allowed =
      this.antiSpamService.canExecute(
        command.playerId
      )

    if (!allowed) {
      return
    }

    this.sessionManager.heartbeat(
      command.playerId
    )

    switch (command.type) {
      case "JOIN_GAME":
        this.handleJoinCommand(
          match,
          command
        )
        break

      case "CHAT_MESSAGE":
        this.eventEmitter.emit(
          createGameEvent(
            "CHAT_MESSAGE",
            `${command.playerId}: ${command.payload.message}`
          )
        )
        break
    }
  }

  private handleJoinCommand(
    match: any,
    command: QueuedCommand
  ) {
    const player =
      this.playerManager.addPlayer(
        match,
        command.playerId
      )

    this.eventEmitter.emit(
      createGameEvent(
        "PLAYER_JOINED",
        `${player.nickname} joined the match`
      )
    )
  }
}