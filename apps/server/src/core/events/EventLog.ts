export interface EventLogEntry {
  id: string

  message: string

  createdAt: number
}

const MAX_LOG_ENTRIES = 50

export class EventLog {
  add(
    match: any,

    message: string
  ) {
    if (
      !match.state.eventLog
    ) {
      match.state.eventLog =
        []
    }

    const entry: EventLogEntry =
      {
        id: [
          Date.now(),

          Math.random(),
        ].join("_"),

        message,

        createdAt:
          Date.now(),
      }

    match.state.eventLog.unshift(
      entry
    )

    if (
      match.state.eventLog
        .length >
      MAX_LOG_ENTRIES
    ) {
      match.state.eventLog.length =
        MAX_LOG_ENTRIES
    }
  }

  getEntries(
    match: any
  ): EventLogEntry[] {
    return (
      match.state.eventLog ??
      []
    )
  }

  clear(match: any) {
    match.state.eventLog =
      []
  }
}