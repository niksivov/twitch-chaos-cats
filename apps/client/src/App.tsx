import { useEffect, useState } from "react"
import { socketClient } from "./network/socket"
import { useGameStore } from "./store/gameStore"
import { PlayerCard } from "./components/PlayerCard"
import { EventLog } from "./components/EventLog"
import { BoosterSet } from "./components/BoosterSet"
import { TurnTimer } from "./components/TurnTimer"
import { MatchResultScreen } from "./components/MatchResultScreen"

// Фон для стартового экрана (настройки)
import settingsBackground from "./assets/backgrounds/MatchSettings.png"

// Фон для игрового экрана
import gameBackground from "./assets/backgrounds/1.png"

function App() {
  const [started, setStarted] = useState(false)

  const turnTimerSeconds = useGameStore((s) => s.turnTimerSeconds)
  const targetPoints = useGameStore((s) => s.targetPoints)
  const boosterSetSize = useGameStore((s) => s.boosterSetSize)

  const round = useGameStore((s) => s.round)
  const currentTurnPlayerId = useGameStore((s) => s.currentTurnPlayerId)
  const currentTurnStartedAt = useGameStore((s) => s.currentTurnStartedAt)
  const leaderPlayerId = useGameStore((s) => s.leaderPlayerId)
  const players = useGameStore((s) => s.players)
  const recentEvents = useGameStore((s) => s.recentEvents)
  const boosterSet = useGameStore((s) => s.boosterSet)
  const matchPhase = useGameStore((s) => s.phase)

  const matchFinished = useGameStore((s) => s.matchFinished)
  const winnerId = useGameStore((s) => s.matchWinnerId)
  const winReason = useGameStore((s) => s.matchWinReason)
  const matchPlayers = useGameStore((s) => s.matchPlayers)

  const currentPlayer = players.find((player) => player.id === currentTurnPlayerId)

  useEffect(() => {
    socketClient.connect()
    socketClient.onMessage = (data: any) => {
      if (data.type === "matchFinished") {
        useGameStore.setState({
          matchFinished: true,
          matchWinnerId: data.winnerId,
          matchPlayers: data.players,
          matchWinReason: data.reason,
        })
      }
    }

    // Скрыть стрелки у input[type=number]
    const style = document.createElement("style")
    style.innerHTML = `
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  if (!started) {
    return (
      <>
        <img
          src={settingsBackground}
          alt=""
          style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -2, pointerEvents: "none" }}
        />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div
            style={{
              width: 440,
              background: "rgba(26,31,38,0.95)",
              border: "2px solid #6a1b9a",
              borderRadius: 20,
              padding: 32,
              color: "white",
              fontFamily: "Arial, sans-serif",
              boxShadow: "0 0 24px rgba(156,39,176,0.6)",
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 900, marginBottom: 24, textAlign: "center", color: "#e1bee7" }}>
              Твич, Хаос и Котики
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: "center", color: "#d1c4e9" }}>
              Параметры матча
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                Таймер хода (сек)
                <input
                  type="number"
                  min={5}
                  value={turnTimerSeconds}
                  onChange={(e) => useGameStore.setState({ turnTimerSeconds: Number(e.target.value) })}
                  style={{
                    marginTop: 6,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #9575cd",
                    background: "#11161d",
                    color: "white",
                    fontSize: 18,
                    fontWeight: 700,
                    outline: "none",
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                Очки для победы
                <input
                  type="number"
                  min={1}
                  value={targetPoints}
                  onChange={(e) => useGameStore.setState({ targetPoints: Number(e.target.value) })}
                  style={{
                    marginTop: 6,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #9575cd",
                    background: "#11161d",
                    color: "white",
                    fontSize: 18,
                    fontWeight: 700,
                    outline: "none",
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                Количество бустеров в наборе
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={boosterSetSize}
                  onChange={(e) => useGameStore.setState({ boosterSetSize: Number(e.target.value) })}
                  style={{
                    marginTop: 6,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #9575cd",
                    background: "#11161d",
                    color: "white",
                    fontSize: 18,
                    fontWeight: 700,
                    outline: "none",
                  }}
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
                style={{
                  marginTop: 12,
                  padding: "14px 0",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "white",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #9c27b0, #6a1b9a)",
                  boxShadow: "0 0 16px rgba(156,39,176,0.6)",
                  textShadow: "0 0 4px rgba(0,0,0,0.5)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Играть
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (matchFinished && winnerId) {
    return (
      <MatchResultScreen
        winnerId={winnerId}
        players={matchPlayers.length ? matchPlayers : players}
        reason={winReason || "points"}
        onPlayAgain={() => {
          useGameStore.setState({
            matchFinished: false,
            matchWinnerId: undefined,
            matchPlayers: [],
            matchWinReason: undefined,
          })
          setStarted(false)
        }}
      />
    )
  }

  return (
    <>
      <img
        src={gameBackground}
        alt=""
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -2, pointerEvents: "none" }}
      />
      <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.65)", zIndex: -1, pointerEvents: "none" }} />
      <div style={{ minHeight: "100vh", color: "white", padding: 20, fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800 }}>Твич, Хаос и Котики</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 12, borderRadius: 12, background: "#1a1f26", border: "1px solid #2d3742" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#ffd54a" }}>🏆 {targetPoints}</div>
            <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.9 }}>Раунд {round}</div>
            <div style={{ width: 180 }}>
              <TurnTimer startedAt={currentTurnStartedAt} durationSeconds={turnTimerSeconds} playerName={currentPlayer?.nickname} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} isCurrentTurn={player.id === currentTurnPlayerId} isLeader={player.id === leaderPlayerId} />
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