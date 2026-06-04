import React, { useState } from "react"
import backgroundImage from "../assets/backgrounds/MatchSettings.png" // отдельный фон

interface MatchSettingsPageProps {
  onStartMatch: (settings: {
    turnTimeSeconds: number
    targetPoints: number
    boosterSetSize: number
  }) => void
}

export const MatchSettingsPage: React.FC<MatchSettingsPageProps> = ({
  onStartMatch,
}) => {
  const [turnTime, setTurnTime] = useState(30)
  const [targetPoints, setTargetPoints] = useState(50)
  const [boosterSetSize, setBoosterSetSize] = useState(30)

  const handleStart = () => {
    onStartMatch({
      turnTimeSeconds: turnTime,
      targetPoints,
      boosterSetSize,
    })
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          padding: 30,
          borderRadius: 16,
          color: "white",
          maxWidth: 420,
          width: "100%",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Настройки матча</h2>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Время на ход (сек):
            <input
              type="number"
              min={5}
              max={120}
              value={turnTime}
              onChange={(e) => setTurnTime(Number(e.target.value))}
              style={{ marginLeft: "10px", width: "60px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Очки для победы:
            <input
              type="number"
              min={1}
              max={1000}
              value={targetPoints}
              onChange={(e) => setTargetPoints(Number(e.target.value))}
              style={{ marginLeft: "10px", width: "60px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Количество бустеров в сете:
            <input
              type="number"
              min={1}
              max={100}
              value={boosterSetSize}
              onChange={(e) => setBoosterSetSize(Number(e.target.value))}
              style={{ marginLeft: "10px", width: "60px" }}
            />
          </label>
        </div>

        <button
          onClick={handleStart}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: 16,
            width: "100%",
            borderRadius: 12,
            background: "linear-gradient(135deg, #9c27b0, #6a1b9a)",
            border: "none",
            color: "white",
            fontWeight: 700,
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Играть
        </button>
      </div>
    </div>
  )
}