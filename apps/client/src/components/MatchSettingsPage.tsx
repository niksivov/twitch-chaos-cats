import React, { useState } from "react"

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
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Настройки матча</h2>

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
        }}
      >
        Играть
      </button>
    </div>
  )
}