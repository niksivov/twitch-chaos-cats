export interface ParsedChatCommand {
  type: string

  payload?: any
}

export function parseChatCommand(
  message: string
): ParsedChatCommand | null {
  const trimmed =
    message.trim()
    .toLowerCase()

  if (trimmed === "!join") {
    return {
      type: "JOIN_GAME",
    }
  }

  if (
    trimmed.startsWith("!")
  ) {
    return {
      type: "CHAT_MESSAGE",

      payload: {
        message: trimmed,
      },
    }
  }

  return null
}