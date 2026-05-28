import {
  MatchEventSnapshot,
} from "@twitch-chaos-cats/shared-types"

interface Props {
  events: MatchEventSnapshot[]
}

export function EventLog({
  events,
}: Props) {
  return (
    <div
      style={{
        background:
          "#1a1f26",

        border:
          "1px solid #2d3742",

        borderRadius: 12,

        padding: 16,
      }}
    >
      <div
        style={{
          fontWeight: 700,

          marginBottom: 12,

          fontSize: 16,
        }}
      >
        Event Log
      </div>

      <div
        style={{
          display: "flex",

          flexDirection:
            "column",

          gap: 8,
        }}
      >
        {events.map((event) => {
          return (
            <div
              key={event.id}
              style={{
                fontSize: 13,

                opacity: 0.9,

                lineHeight: 1.4,
              }}
            >
              {event.text}
            </div>
          )
        })}

        {events.length === 0 && (
          <div
            style={{
              opacity: 0.5,

              fontSize: 13,
            }}
          >
            No events yet
          </div>
        )}
      </div>
    </div>
  )
}