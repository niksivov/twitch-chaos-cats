import { useEffect, useState } from "react"
import { socketClient } from "./network/socket"
import { useGameStore } from "./store/gameStore"
import { PlayerCard } from "./components/PlayerCard"
import { EventLog } from "./components/EventLog"
import { BoosterSet } from "./components/BoosterSet"
import { TurnTimer } from "./components/TurnTimer"
import { MatchResultScreen } from "./components/MatchResultScreen"
import { HowToPlayModal } from "./components/HowToPlayModal"

// Фоны
import settingsBackground from "./assets/backgrounds/MatchSettings.png"
import gameBackground from "./assets/backgrounds/Game1.png"
import channelSelectBackground from "./assets/backgrounds/ChannelSelectPage.png"

function App() {
  const screen = useGameStore((s) => s.screen)
  const setScreen = useGameStore((s) => s.setScreen)

  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [maxPlayersRaw, setMaxPlayersRaw] = useState(() =>
    String(useGameStore.getState().maxPlayers)
  )
  const [maxPlayersError, setMaxPlayersError] = useState<string | null>(null)

  const turnTimeSeconds = useGameStore((s) => s.turnTimeSeconds)
  const targetPoints = useGameStore((s) => s.targetPoints)
  const boosterSetSize = useGameStore((s) => s.boosterSetSize)
  const twitchChannel = useGameStore((s) => s.twitchChannel)
  const maxPlayers = useGameStore((s) => s.maxPlayers)

  const round = useGameStore((s) => s.round)
  const currentTurnPlayerId = useGameStore((s) => s.currentTurnPlayerId)
  const currentTurnStartedAt = useGameStore((s) => s.currentTurnStartedAt)
  const leaderPlayerId = useGameStore((s) => s.leaderPlayerId)
  const players = useGameStore((s) => s.players)
  const recentEvents = useGameStore((s) => s.recentEvents)
  const boosterSet = useGameStore((s) => s.boosterSet)
  const turnOrder = useGameStore((s) => s.turnOrder)
  const winnerId = useGameStore((s) => s.matchWinnerId)
  const winReason = useGameStore((s) => s.matchWinReason)
  const matchPlayers = useGameStore((s) => s.matchPlayers)
  const roomId = useGameStore((s) => s.roomId)

  const currentPlayer = players.find(
    (player) => player.id === currentTurnPlayerId
  )
 
  const lobbyPlayers = useGameStore((s) => s.lobbyPlayers)

  const orderedPlayers = turnOrder.length
    ? turnOrder
        .map(id => players.find(p => p.id === id))
       .filter((p): p is NonNullable<typeof p> => p != null)
    : players

useEffect(() => {
  socketClient.connect()

  socketClient.onMessage = (_data: any) => {
  }
 
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
    return (): void => {
  document.head.removeChild(style)
}
  }, [])

  // ===== ChannelSelectPage =====
  if (screen === "CHANNEL_SELECT") {
    return (
      <>
        <img
          src={channelSelectBackground}
          alt=""
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -2,
            pointerEvents: "none",
          }}
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
              Выберите канал и максимальное количество игроков
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                Канал Twitch
                <input
                  type="text"
                  value={twitchChannel}
                  onChange={(e) => useGameStore.setState({ twitchChannel: e.target.value })}
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
                Максимальное количество игроков (от 2 до 20)
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={maxPlayersRaw}
                  onChange={(e) => {
                    const v = e.target.value
                    setMaxPlayersRaw(v)
                    const n = Number(v)
                    if (v.trim() === "" || !Number.isInteger(n) || n < 2 || n > 20) {
                      setMaxPlayersError("Введите целое число от 2 до 20")
                    } else {
                      setMaxPlayersError(null)
                      useGameStore.setState({ maxPlayers: n })
                    }
                  }}
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

              {maxPlayersError && (
                <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>
                  {maxPlayersError}
                </div>
              )}

              <button
                disabled={!!maxPlayersError}
                onClick={() => {
                  if (maxPlayersError) return
                  if (twitchChannel.trim()) {
                    socketClient.sendMessage({
                      type: "START_TWITCH_BOT",
                      payload: { channel: twitchChannel },
                    })
                    setScreen("MATCH_SETTINGS")
                  }
                }}
                style={{
                  marginTop: 12,
                  padding: "14px 0",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "white",
                  cursor: maxPlayersError ? "not-allowed" : "pointer",
                  opacity: maxPlayersError ? 0.5 : 1,
                  background: "linear-gradient(135deg, #9c27b0, #6a1b9a)",
                  boxShadow: "0 0 16px rgba(156,39,176,0.6)",
                  textShadow: "0 0 4px rgba(0,0,0,0.5)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Далее
              </button>

              <div
                onClick={() => setShowHowToPlay(true)}
                style={{
                  marginTop: 14,
                  textAlign: "center",
                  color: "#e1bee7",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Как играть
              </div>
            </div>
          </div>
        </div>
      <HowToPlayModal open={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
      </>
    )
  }

  // ===== MatchSettingsPage =====
  if (screen === "MATCH_SETTINGS") {
    return (
      <>
        <img
          src={settingsBackground}
          alt=""
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -2,
            pointerEvents: "none",
          }}
        />

        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div
            style={{
              width: 500,
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
              Настройки матча
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                Таймер хода (в секундах)
                <input
                  type="number"
                  min={5}
                  value={turnTimeSeconds}
                  onChange={(e) =>
                    useGameStore.setState({ turnTimeSeconds: Number(e.target.value) })
                  }
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
                  onChange={(e) =>
                    useGameStore.setState({ targetPoints: Number(e.target.value) })
                  }
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
                  onChange={(e) =>
                    useGameStore.setState({ boosterSetSize: Number(e.target.value) })
                  }
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
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                Напиши в чат !join и присоединяйся. Зарегистрированные игроки:
              </div>

              {lobbyPlayers.length === 0 && (
                <div style={{ color: "#ccc" }}>Ожидание игроков в чате...</div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {lobbyPlayers.map((p) => (
                  <div
                    key={`${p.twitchUserId}-${p.avatarId}-${p.username}`}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: "#2d2d2d",
                      fontWeight: 600,
                    }}
                  >
                    {p.username} ({p.avatarId})
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                socketClient.createMatch({
                  turnTimeSeconds,
                  targetPoints,
                  boosterSetSize,
                  twitchChannel,
                  maxPlayers,
                })
                setScreen("GAME")
              }}
              style={{
                marginTop: 20,
                padding: "14px 0",
                width: "100%",
                display: "block",
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

              <div
                onClick={() => setShowHowToPlay(true)}
                style={{
                  marginTop: 14,
                  textAlign: "center",
                  color: "#e1bee7",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Как играть
              </div>
          </div>
        </div>
      <HowToPlayModal open={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
      </>
    )
  }

  // ===== MatchResultScreen =====
if (screen === "RESULT") {
  return (
    <MatchResultScreen
      winnerId={winnerId ?? ""}
      players={
  (matchPlayers?.length ? matchPlayers : players).map((p: any) => ({
    id: p.id,
    username: p.username ?? p.nickname ?? "unknown",
    score: p.score ?? 0,
    twitchUserId: p.twitchUserId ?? "",
    avatarId: p.avatarId ?? "cat1",
    eliminated: p.eliminated ?? false,
  }))
}
      reason={winReason || "points"}
      onPlayAgain={() =>
        useGameStore.setState({
          matchFinished: false,
          matchWinnerId: undefined,
          matchPlayers: [],
          matchWinReason: undefined,
          screen: "CHANNEL_SELECT",
        })
      }
    />
  )
}

  // ===== GamePage =====
  if (screen === "GAME") {
    if (!players.length || !roomId) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 24,
          }}
        >
          Waiting for match...
        </div>
      )
    }

    return (
      <>
        <img
          src={gameBackground}
          alt=""
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -2,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.65)", zIndex: -1 }} />

        <div style={{ minHeight: "100vh", color: "white", padding: 20, fontFamily: "Arial, sans-serif" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 800 }}>Твич, Хаос и Котики</div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 12,
              borderRadius: 12,
              background: "#1a1f26",
              border: "1px solid #2d3742",
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#ffd54a" }}>
                🏆 {targetPoints}
              </div>

              <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.9 }}>
                Раунд {round}
              </div>

              <div style={{ width: 180 }}>
                <TurnTimer
                  startedAt={currentTurnStartedAt}
                  durationSeconds={turnTimeSeconds}
                  playerName={currentPlayer?.nickname}
                />
              </div>

              <button
                onClick={() => {
                  useGameStore.getState().resetToStart()
                  socketClient.sendMessage({ type: "RESET_MATCH" })
                }}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "1px solid #9575cd",
                  background: "linear-gradient(135deg, #9c27b0, #6a1b9a)",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🔄 Сброс
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            {orderedPlayers.map((player) => (
              <PlayerCard
                key={player.id ?? player.nickname ?? `${player.nickname}-${player.avatarId}`}
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

  return null
}

export default App