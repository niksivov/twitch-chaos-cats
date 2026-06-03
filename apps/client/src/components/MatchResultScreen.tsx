import React from "react"

type MatchPlayer = {
  id: string
  nickname: string
  avatarId: string
  points: number
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
  const winner =
    players.find((p) => p.id === winnerId)

  const sortedPlayers =
    [...players].sort(
      (a, b) => b.points - a.points
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
        backgroundColor: "#1a1f26",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        🏆 Победитель!
      </div>

      {winner && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <img
            src={`/avatars/${winner.avatarId}.png`}
            alt={winner.nickname}
            style={{
              width: 120,
              height: 120,
              objectFit: "contain",
              marginBottom: 12,
            }}
          />

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {winner.nickname}
          </div>

          <div
            style={{
              fontSize: 22,
              marginBottom: 6,
            }}
          >
            {winner.points} очков
          </div>

          {reason && (
            <div
              style={{
                fontSize: 16,
                opacity: 0.8,
              }}
            >
              ({reason === "points"
                ? "по очкам"
                : reason})
            </div>
          )}
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: 500,
          marginBottom: 32,
        }}
      >
        <h3
          style={{
            marginBottom: 16,
          }}
        >
          Финальный рейтинг
        </h3>

        <ol
          style={{
            paddingLeft: 28,
            fontSize: 22,
            lineHeight: 1.8,
          }}
        >
          {sortedPlayers.map((player) => (
            <li key={player.id}>
              {player.nickname} — {player.points} очков
            </li>
          ))}
        </ol>
      </div>

      {onPlayAgain && (
        <button
          onClick={onPlayAgain}
          style={{
            padding: "12px 24px",
            fontSize: 18,
            fontWeight: 700,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            backgroundColor: "#4caf50",
            color: "white",
          }}
        >
          Играть снова
        </button>
      )}
    </div>
  )
}