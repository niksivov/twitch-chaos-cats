import { useEffect, useState } from "react"
import { socketClient } from "./network/socket"
import { useGameStore } from "./store/gameStore"
import { PlayerCard } from "./components/PlayerCard"
import { EventLog } from "./components/EventLog"
import { BoosterSet } from "./components/BoosterSet"
import { TurnTimer } from "./components/TurnTimer"
import { MatchResultScreen } from "./components/MatchResultScreen"
import { HowToPlayModal } from "./components/HowToPlayModal"
import { WheelSpinner } from "./components/WheelSpinner"

// Фоны
import settingsBackground from "./assets/backgrounds/MatchSettings.png"
import gameBackground from "./assets/backgrounds/Game1.png"
import channelSelectBackground from "./assets/backgrounds/ChannelSelectPage.png"

function App() {
  const screen = useGameStore((s) => s.screen)
  const setScreen = useGameStore((s) => s.setScreen)

  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showBoosterTable, setShowBoosterTable] = useState(false)
  const boosterCatalog = useGameStore((s) => s.boosterCatalog)
  const [maxPlayersRaw, setMaxPlayersRaw] = useState(() =>
    String(useGameStore.getState().maxPlayers)
  )
  const [maxPlayersError, setMaxPlayersError] = useState<string | null>(null)

  const [turnTimeSecondsRaw, setTurnTimeSecondsRaw] = useState(() =>
    String(useGameStore.getState().turnTimeSeconds)
  )
  const [turnTimeSecondsError, setTurnTimeSecondsError] = useState<string | null>(null)

  const [targetPointsRaw, setTargetPointsRaw] = useState(() =>
    String(useGameStore.getState().targetPoints)
  )
  const [targetPointsError, setTargetPointsError] = useState<string | null>(null)

  const turnTimeSeconds = useGameStore((s) => s.turnTimeSeconds)
  const targetPoints = useGameStore((s) => s.targetPoints)
  const maxPoolSize = boosterCatalog.reduce((sum, b) => sum + b.poolCount, 0) || 1

  const boosterSetSize = useGameStore((s) => s.boosterSetSize)
  const twitchChannel = useGameStore((s) => s.twitchChannel)
  const maxPlayers = useGameStore((s) => s.maxPlayers)

  const round = useGameStore((s) => s.round)
  const currentTurnPlayerId = useGameStore((s) => s.currentTurnPlayerId)
  const currentTurnStartedAt = useGameStore((s) => s.currentTurnStartedAt)
  const leaderIds = useGameStore((s) => s.leaderIds)
  const players = useGameStore((s) => s.players)
  const recentEvents = useGameStore((s) => s.recentEvents)
  const boosterSet = useGameStore((s) => s.boosterSet)
  const turnOrder = useGameStore((s) => s.turnOrder)
  const winnerId = useGameStore((s) => s.matchWinnerId)
  const winReason = useGameStore((s) => s.matchWinReason)
  const matchPlayers = useGameStore((s) => s.matchPlayers)
  const roomId = useGameStore((s) => s.roomId)
  const wheelResult = useGameStore((s) => s.wheelResult)

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
                disabled={!!maxPlayersError || !!turnTimeSecondsError}
                onClick={() => {
                  if (maxPlayersError || turnTimeSecondsError) return
                  if (twitchChannel.trim()) {
                    socketClient.joinRoom(twitchChannel.trim())
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
                Таймер хода (в секундах, от 5 до 600)
                <input
                  type="number"
                  min={5}
                  max={600}
                  value={turnTimeSecondsRaw}
                  onChange={(e) => {
                    const v = e.target.value
                    setTurnTimeSecondsRaw(v)
                    const n = Number(v)
                    if (v.trim() === "" || !Number.isInteger(n) || n < 5 || n > 600) {
                      setTurnTimeSecondsError("Введите целое число от 5 до 600")
                    } else {
                      setTurnTimeSecondsError(null)
                      useGameStore.setState({ turnTimeSeconds: n })
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

              {turnTimeSecondsError && (
                <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>
                  {turnTimeSecondsError}
                </div>
              )}

              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                Очки для победы (от 50)
                <input
                  type="number"
                  min={50}
                  value={targetPointsRaw}
                  onChange={(e) => {
                    const v = e.target.value
                    setTargetPointsRaw(v)
                    const n = Number(v)
                    if (v.trim() === "" || !Number.isInteger(n) || n < 50) {
                      setTargetPointsError("Введите целое число от 50")
                    } else {
                      setTargetPointsError(null)
                      useGameStore.setState({ targetPoints: n })
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

              {targetPointsError && (
                <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>
                  {targetPointsError}
                </div>
              )}

              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                Количество бустеров в наборе (от 1 до {maxPoolSize})
                <input
                  type="number"
                  min={1}
                  max={maxPoolSize}
                  value={boosterSetSize}
                  onChange={(e) => {
                    const raw = Number(e.target.value)
                    if (raw >= 1 && raw <= maxPoolSize) {
                      useGameStore.setState({ boosterSetSize: raw })
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
              disabled={!!turnTimeSecondsError || !!targetPointsError}
              onClick={() => {
                if (turnTimeSecondsError || targetPointsError) return
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
                cursor: (turnTimeSecondsError || targetPointsError) ? "not-allowed" : "pointer",
                opacity: (turnTimeSecondsError || targetPointsError) ? 0.5 : 1,
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

              <div
                onClick={() => setShowBoosterTable(!showBoosterTable)}
                style={{
                  marginTop: 14,
                  textAlign: "center",
                  color: "#ffd54a",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {showBoosterTable ? "▲" : "▼"} Все бустеры ({boosterCatalog.length} видов, {boosterCatalog.reduce((s, b) => s + b.poolCount, 0)} в пуле)
              </div>

              {showBoosterTable && (
                <div style={{
                  marginTop: 12,
                  maxHeight: 400,
                  overflowY: "auto",
                  border: "1px solid #f8d407",
                  borderRadius: 10,
                  background: "#101418",
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#1a1f26", position: "sticky", top: 0 }}>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "#ffd54a", borderBottom: "1px solid #2d3742", width: 40 }}></th>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "#ffd54a", borderBottom: "1px solid #2d3742", width: 110 }}>Название</th>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "#ffd54a", borderBottom: "1px solid #2d3742" }}>Описание</th>
                        <th style={{ padding: "8px 6px", textAlign: "center", color: "#ffd54a", borderBottom: "1px solid #2d3742", width: 50 }}>Пул</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boosterCatalog.map((b) => (
                        <tr key={b.id} style={{ borderBottom: "1px solid #1a1f26" }}>
                          <td style={{ padding: "6px", textAlign: "center" }}>
                            <img src={`/boosters/${b.icon}.png`} alt={b.name} style={{ width: 100, height: 100, objectFit: "contain" }} />
                          </td>
                          <td style={{ padding: "6px", fontWeight: 600, whiteSpace: "normal", wordBreak: "break-word" }}>{b.name}</td>
                          <td style={{ padding: "6px", color: "#aaa", lineHeight: "18px" }}>{b.description}</td>
                          <td style={{ padding: "6px", textAlign: "center", fontWeight: 700, color: b.poolCount === 0 ? "#ff6b6b" : "#00ff66" }}>{b.poolCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

              <div style={{ minWidth: 240 }}>
                <TurnTimer
                  startedAt={currentTurnStartedAt}
                  durationSeconds={turnTimeSeconds}
                  playerName={currentPlayer?.nickname}
                />
              </div>

              <button
                onClick={() => setShowHowToPlay(true)}
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
                Как играть
              </button>
            </div>
          </div>

          <div style={{
            textAlign: "right",
            fontSize: 16,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 16,
          }}>
            Команда стримера <code style={{
              color: "#ffd54a",
              background: "linear-gradient(135deg, #9c27b0, #6a1b9a)",
              padding: "2px 8px",
              borderRadius: 6,
            }}>!reset</code> сбросит текущую игру
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            {orderedPlayers.map((player, index) => (
              <PlayerCard
                key={player.id ?? player.nickname ?? `${player.nickname}-${player.avatarId}`}
                player={player}
                index={index}
                isCurrentTurn={player.id === currentTurnPlayerId}
                isLeader={leaderIds.includes(player.id)}
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

        <HowToPlayModal open={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

        {wheelResult && (
          <WheelSpinner
            players={wheelResult.players}
            winnerId={wheelResult.winnerId}
            onClose={() => useGameStore.setState({ wheelResult: null })}
          />
        )}
      </>
    )
  }

  return null
}

export default App