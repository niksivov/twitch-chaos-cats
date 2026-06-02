import { useEffect, useState } from "react"
import { socketClient } from "./network/socket"
import { useGameStore } from "./store/gameStore"
import { PlayerCard } from "./components/PlayerCard"
import { EventLog } from "./components/EventLog"
import { BoosterSet } from "./components/BoosterSet"
import { TurnTimer } from "./components/TurnTimer"
import backgroundImage from "./assets/backgrounds/1.png"

function App() {
  const [started, setStarted] = useState(false)
  const [turnTimerSeconds, setTurnTimerSeconds] = useState(15)
  const [targetPoints, setTargetPoints] = useState(100)
  const [boosterSetSize, setBoosterSetSize] = useState(3)

  const round = useGameStore((state) => state.round)
  const currentTurnPlayerId = useGameStore((state) => state.currentTurnPlayerId)
  const currentTurnStartedAt = useGameStore((state) => state.currentTurnStartedAt)
  const leaderPlayerId = useGameStore((state) => state.leaderPlayerId)
  const players = useGameStore((state) => state.players)
  const recentEvents = useGameStore((state) => state.recentEvents)
  const boosterSet = useGameStore((state) => state.boosterSet)

  const currentPlayer = players.find((player) => player.id === currentTurnPlayerId)

  useEffect(() => {
    socketClient.connect()
  }, [])

  useEffect(() => {
    console.log("PLAYERS STATE:", players)
  }, [players])

  if (!started) {
    return (
      <>
        <img
          src={backgroundImage}
          alt=""
          style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -2, pointerEvents: "none" }}
        />
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.75)", zIndex: -1, pointerEvents: "none" }}
        />
        <div
          style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div
            style={{ width: 420, background: "#1a1f26", border: "1px solid #2d3742", borderRadius: 16, padding: 24, color: "white", fontFamily: "Arial, sans-serif" }}
          >
            <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 24, textAlign: "center" }}>
              Твич, Хаос и Котики
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Параметры матча</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label>
                <div style={{ marginBottom: 6 }}>Таймер хода (сек)</div>
                <input
                  type="number"
                  min={5}
                  value={turnTimerSeconds}
                  onChange={(e) => setTurnTimerSeconds(Number(e.target.value))}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #39424f", background: "#11161d", color: "white" }}
                />
              </label>
              <label>
                <div style={{ marginBottom: 6 }}>Очки для победы</div>
                <input
                  type="number"
                  min={1}
                  value={targetPoints}
                  onChange={(e) => setTargetPoints(Number(e.target.value))}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #39424f", background: "#11161d", color: "white" }}
                />
              </label>
              <label>
                <div style={{ marginBottom: 6 }}>Количество бустеров в сете</div>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={boosterSetSize}
                  onChange={(e) => setBoosterSetSize(Number(e.target.value))}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #39424f", background: "#11161d", color: "white" }}
                />
              </label>
              <button
                onClick={() => {
                  socketClient.createMatch({
                    turnTimerSeconds,
                    targetPoints,
                    boosterSetSize,
                  })
                  setStarted(true)
                }}
                style={{ marginTop: 8, padding: "12px 16px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 18, fontWeight: 700 }}
              >
                Играть
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <img
        src={backgroundImage}
        alt=""
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -2, pointerEvents: "none" }}
      />
      <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.65)", zIndex: -1, pointerEvents: "none" }} />
      <div style={{ minHeight: "100vh", color: "white", padding: 20, fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800 }}>Твич, Хаос и Котики</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 12, borderRadius: 12, background: "#1a1f26", border: "1px solid #2d3742" }}>
            <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.9 }}>Раунд {round}</div>
            <div style={{ width: 180 }}>
              <TurnTimer startedAt={currentTurnStartedAt} durationSeconds={turnTimerSeconds} playerName={currentPlayer?.nickname} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isCurrentTurn={player.id === currentTurnPlayerId}
              isLeader={player.id === leaderPlayerId}
            />
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <BoosterSet boosters={boosterSet} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <EventLog events={recentEvents} />
        </div>
      </div>
    </>
  )
}

export default App