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

export function PlayerCard({ player, isCurrentTurn, isLeader }: Props) {
  return (
    <div
      style={{
        background: "#1a1f26",
        border: "1px solid #2d3742", // всегда один border для стабильности
        borderRadius: 12,
        padding: 12,
        opacity: player.eliminated ? 0.3 : 1,
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        minHeight: 230, // фиксируем высоту, чтобы блоки не прыгали
        boxShadow: isCurrentTurn
          ? "0 0 0 3px #00ff66, 0 0 12px rgba(0,255,102,0.25)" // зеленая рамка поверх блока
          : "none",
      }}
    >
      <div
        style={{
          position: "relative",
          marginBottom: 10,
        }}
      >
        <img
          src={`/avatars/${player.avatarId}.png`}
          alt={player.nickname}
          onError={(e) => {
            e.currentTarget.src = "/avatars/default.png"
          }}
          style={{
            width: 140,
            height: 140,
            borderRadius: 16,
            border: "1px solid #b14cff",
            objectFit: "cover",
            background: "#2b3542",
            imageRendering: "pixelated",
            display: "block",
          }}
        />

        {isLeader && (
          <div
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              fontSize: 22,
              filter: "drop-shadow(0 0 6px gold)",
            }}
          >
            👑
          </div>
        )}
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: 15,
          maxWidth: 140,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: 6,
        }}
      >
        {player.nickname}
      </div>

      <div
        style={{
          width: "100%",
          borderTop: "1px solid #2d3742",
          paddingTop: 8,
          fontSize: 22,
          fontWeight: 800,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
        }}
      >
        🪙 {player.points}
      </div>
    </div>
  )
}