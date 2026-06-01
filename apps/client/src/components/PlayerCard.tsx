interface PlayerSnapshot {
  id: string
  nickname: string
  avatarId: string
  points: number
  eliminated: boolean
}

interface Props {
  player: PlayerSnapshot
  isCurrentTurn: boolean
  isLeader: boolean
}

export function PlayerCard({
  player,
  isCurrentTurn,
  isLeader,
}: Props) {
  return (
    <div
      style={{
        background: "#1a1f26",
        border: isCurrentTurn
          ? "2px solid #00ff66"
          : "1px solid #2d3742",
        borderRadius: 12,
        padding: 12,
        opacity: player.eliminated ? 0.4 : 1,
        transition: "all 0.2s ease",
        boxShadow: isCurrentTurn
          ? "0 0 12px rgba(0,255,102,0.25)"
          : "none",
      }}
    >
      {/* TOP SECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          {/* AVATAR */}
          <img
            src={`/avatars/${player.avatarId}.png`}
            alt={player.nickname}
            onError={(e) => {
              e.currentTarget.src = "/avatars/default.png"
            }}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              objectFit: "cover",
              background: "#2b3542",
              flexShrink: 0,
            }}
          />

          {/* INFO */}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 140,
              }}
            >
              {player.nickname}
            </div>

            {player.eliminated && (
              <div
                style={{
                  fontSize: 12,
                  color: "#ff6666",
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                ВЫБЫЛ
              </div>
            )}
          </div>
        </div>

        {/* LEADER */}
        {isLeader && (
          <div
            style={{
              fontSize: 18,
              marginLeft: 6,
              filter: "drop-shadow(0 0 6px gold)",
            }}
          >
            👑
          </div>
        )}
      </div>

      {/* POINTS */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        🪙 {player.points}
      </div>
    </div>
  )
}