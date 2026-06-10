import React from "react"
import backgroundImage from "../assets/backgrounds/MatchResultScreen.png"

type MatchPlayer = {
  id: string
  twitchUserId: string
  username: string
  avatarId: string
  score: number
  eliminated: boolean
}

interface MatchResultScreenProps {
  winnerId: string
  players: MatchPlayer[]
  reason?: string
  onPlayAgain?: () => void
}

export const MatchResultScreen: React.FC<MatchResultScreenProps> = ({
  winnerId,
  players,
  reason,
  onPlayAgain,
}) => {
  console.log("RESULT SCREEN PROPS", {
    winnerId,
    players,
  })

  // ✅ FIX: унифицировали сравнение ID (только id)
  const winner =
  players.find(
    (p) =>
      p.id === winnerId ||
      p.twitchUserId === winnerId
  )


console.log("RAW PLAYERS", players)
console.log("WINNER ID", winnerId)
console.log("FOUND WINNER", winner)


  // ✅ FIX: защита от undefined points
  const sortedPlayers =
    [...players].sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0)
    )

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: 20,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={backgroundImage}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.65)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontSize: 36,
          fontWeight: 900,
          marginBottom: 32,
          textShadow: "0 0 12px rgba(255,215,0,0.6)",
        }}
      >
        🏆 Победитель!
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: 40,
          marginBottom: 40,
          flexWrap: "wrap",
        }}
      >
        {/* Левая часть */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            background: "rgba(26,31,38,0.75)",
            border: "4px solid rgba(156,39,176,0.4)",
            borderRadius: 20,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(6px)",
          }}
        >
          {winner && (
            <>
              <img
                src={`/avatars/${winner.avatarId}.png`}
                alt={winner.username}
                style={{
                  width: 380,
                  height: 380,
                  objectFit: "contain",
                  marginBottom: 20,
                  imageRendering: "pixelated",
                }}
              />

              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  marginBottom: 10,
                }}
              >
                {winner.username}
              </div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#ffd54f",
                  marginBottom: 10,
                }}
              >
                🪙 {winner.score}
              </div>

              {reason && (
                <div
                  style={{
                    fontSize: 18,
                    opacity: 0.85,
                  }}
                >
                  {reason === "points"
                    ? "Победа по очкам"
                    : reason}
                </div>
              )}
            </>
          )}
        </div>

        {/* Правая часть */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            background: "rgba(26,31,38,0.75)",
            border: "4px solid rgba(156,39,176,0.4)",
            borderRadius: 20,
            padding: 32,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Финальный рейтинг
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {sortedPlayers.map((player) => (
              <div
                key={player.id}   // ✅ FIX: стабильный key
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  border:
                    player.id === winnerId   // ✅ FIX: единый id
                      ? "1px solid #ffd54f"
                      : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ fontWeight: 700 }}>
                  {player.username}
                </span>

                <span
                  style={{
                    fontWeight: 800,
                    color: "#ffd54f",
                  }}
                >
                  🪙 {player.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {onPlayAgain && (
        <button
          onClick={onPlayAgain}
          style={{
            padding: "16px 42px",
            fontSize: 22,
            fontWeight: 900,
            borderRadius: 16,
            border: "1px solid #d28cff",
            cursor: "pointer",
            color: "white",
            background:
              "linear-gradient(135deg, #c14cff 0%, #8b2cf5 50%, #5a1be0 100%)",
            boxShadow: "0 0 25px rgba(156,39,176,0.6)",
            textShadow: "0 0 8px rgba(255,255,255,0.4)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.06)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
          }}
        >
          🎮 Играть снова
        </button>
      )}
    </div>
  )
}