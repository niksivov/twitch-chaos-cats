import { getPlayerColor } from "../utils/getPlayerColor"
import { useGameStore } from "../store/gameStore"

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
  const players = useGameStore((s) => s.players)

  return (
    <div
      style={{
        background:
          "rgba(26, 31, 38, 0.8)",

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

            const player = players.find((p) =>
              event.message.includes(p.nickname)
            )

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

                  color: player
                    ? getPlayerColor(player.id)
                    : "white",
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