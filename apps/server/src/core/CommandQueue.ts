export interface QueuedCommand {
  id: string

  roomId: string

  playerId: string

  type: string

  payload?: any

  createdAt: number
}

export class CommandQueue {
  private commands: QueuedCommand[] =
    []

  enqueue(command: QueuedCommand) {
    this.commands.push(command)
  }

  drain(): QueuedCommand[] {
    const commands = [
      ...this.commands,
    ]

    this.commands = []

    return commands
  }
}