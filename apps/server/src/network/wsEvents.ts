export const WS_EVENTS = {
  PING: "ping",

  HEARTBEAT: "heartbeat",

  HEARTBEAT_ACK:
    "heartbeat_ack",

  MATCH_STATE:
    "match_state",

  STREAMER_SESSION:
    "streamer_session",

  CREATE_MATCH:
    "create_match",
} as const

export type WsEventType =
  (typeof WS_EVENTS)[keyof typeof WS_EVENTS]

export interface WsMessage<
  TType extends string,
  TPayload = unknown,
> {
  type: TType

  payload?: TPayload
}

export interface MatchStatePayload {
  match: unknown
}

export interface StreamerSessionPayload {
  channel: string

  sessionId: string
}

export interface CreateMatchPayload {
  turnTimerSeconds: number

  targetPoints: number

  boosterSetSize: number
}

export function isWsMessage(
  value: unknown
): value is WsMessage<string> {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return false
  }

  const message =
    value as Record<
      string,
      unknown
    >

  return (
    typeof message.type ===
    "string"
  )
}