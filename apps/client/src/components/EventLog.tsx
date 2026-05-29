interface MatchEventSnapshot {
  id: string

  message: string
}

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

        height: "100%",
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

          maxHeight: 400,

          overflowY: "auto",
        }}
      >
        {events.map((event) => {
          return (
            <div
              key={event.id}
              style={{
                background:
                  "#101418",

                border:
                  "1px solid #2d3742",

                borderRadius: 10,

                padding:
                  "10px 12px",

                fontSize: 13,

                lineHeight: 1.4,
              }}
            >
              {event.message}
            </div>
          )
        })}

        {events.length ===
          0 && (
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