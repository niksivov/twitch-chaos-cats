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
      }}
    >
      <div
        style={{
          fontWeight: 700,

          marginBottom: 12,

          fontSize: 16,
        }}
      >
        События
      </div>

      <div
        style={{
          display: "flex",

          flexDirection:
            "column",

          maxHeight: 200,

          overflowY: "auto",

          paddingRight: 4,
        }}
      >
        {events.map(
          (event, index) => {
            const isLast =
              index ===
              events.length - 1

            return (
              <div
                key={event.id}
                style={{
                  padding:
                    "10px 0",

                  fontSize: 14,

                  lineHeight: 1.5,

                  borderBottom:
                    isLast
                      ? "none"
                      : "1px solid #2d3742",
                }}
              >
                ⚡ {event.message}
              </div>
            )
          }
        )}

        {events.length ===
          0 && (
          <div
            style={{
              opacity: 0.5,

              fontSize: 13,
            }}
          >
            Событий пока нет
          </div>
        )}
      </div>
    </div>
  )
}