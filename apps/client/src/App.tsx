import { useEffect, useState, useCallback } from "react"
import { socketClient } from "./network/socket"
import { useGameStore } from "./store/gameStore"
import { PlayerCard } from "./components/PlayerCard"
import { EventLog } from "./components/EventLog"
import { BoosterSet } from "./components/BoosterSet"
import { TurnTimer } from "./components/TurnTimer"
import { MatchResultScreen } from "./components/MatchResultScreen"
import { HowToPlayModal } from "./components/HowToPlayModal"
import { WheelSpinner } from "./components/WheelSpinner"
import { PandoraSpinner } from "./components/PandoraSpinner"

// Фоны
import settingsBackground from "./assets/backgrounds/MatchSettings.webp"
import gameBackground from "./assets/backgrounds/Game1.webp"
import channelSelectBackground from "./assets/backgrounds/ChannelSelectPage.webp"

const INPUT_STYLE: React.CSSProperties = {
  marginTop: 6,
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #9575cd",
  background: "#11161d",
  color: "white",
  fontSize: 18,
  fontWeight: 700,
  outline: "none",
}

const PRIMARY_BUTTON_STYLE: React.CSSProperties = {
  background: "linear-gradient(135deg, #9c27b0, #6a1b9a)",
  boxShadow: "0 0 16px rgba(156,39,176,0.6)",
  textShadow: "0 0 4px rgba(0,0,0,0.5)",
  border: "none",
  borderRadius: 12,
  color: "white",
  fontSize: 18,
  fontWeight: 800,
  cursor: "pointer",
}

function useValidatedNumericInput(
  storageKey: string,
  min: number,
  max: number,
  errorMsg: string
) {
  const [raw, setRaw] = useState(() => String(useGameStore.getState()[storageKey as keyof ReturnType<typeof useGameStore.getState>]))
  const [error, setError] = useState<string | null>(null)

  const value = useGameStore((s) => s[storageKey as keyof typeof s]) as number

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setRaw(v)
    const n = Number(v)
    if (v.trim() === "" || !Number.isInteger(n) || n < min || n > max) {
      setError(errorMsg)
    } else {
      setError(null)
      useGameStore.setState({ [storageKey]: n } as any)
    }
  }, [min, max, errorMsg, storageKey])

  return { raw, error, value, onChange }
}

function App() {
  const screen = useGameStore((s) => s.screen)
  const setScreen = useGameStore((s) => s.setScreen)

  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showBoosterTable, setShowBoosterTable] = useState(false)
  const boosterCatalog = useGameStore((s) => s.boosterCatalog)
  const maxPoolSize = boosterCatalog.reduce((sum, b) => sum + b.poolCount, 0) || 1

  const maxPlayers = useValidatedNumericInput("maxPlayers", 2, 20, "Введите целое число от 2 до 20")
  const turnTimeSeconds = useValidatedNumericInput("turnTimeSeconds", 5, 600, "Введите целое число от 5 до 600")
  const targetPoints = useValidatedNumericInput("targetPoints", 50, Infinity, "Введите целое число от 50")
  const boosterSetSize = useValidatedNumericInput("boosterSetSize", 1, maxPoolSize, `Введите целое число от 1 до ${maxPoolSize}`)

  const twitchChannel = useGameStore((s) => s.twitchChannel)
  const lobbyPlayers = useGameStore((s) => s.lobbyPlayers)

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
  const pandoraResult = useGameStore((s) => s.pandoraResult)

  const currentPlayer = players.find(
    (player) => player.id === currentTurnPlayerId
  )

  const orderedPlayers = turnOrder.length
    ? turnOrder
        .map(id => players.find(p => p.id === id))
       .filter((p): p is NonNullable<typeof p> => p != null)
    : players

useEffect(() => {
  socketClient.connect()

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
                  style={INPUT_STYLE}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                Максимальное количество игроков (от 2 до 20)
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={maxPlayers.raw}
                  onChange={maxPlayers.onChange}
                  style={INPUT_STYLE}
                />
              </label>

              {maxPlayers.error && (
                <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>
                  {maxPlayers.error}
                </div>
              )}

              <button
                disabled={!!maxPlayers.error}
                onClick={() => {
                  if (maxPlayers.error) return
                  if (twitchChannel.trim()) {
                    socketClient.joinRoom(twitchChannel.trim())
                  }
                }}
                style={{
                  ...PRIMARY_BUTTON_STYLE,
                  marginTop: 12,
                  padding: "14px 0",
                  width: "100%",
                  cursor: maxPlayers.error ? "not-allowed" : "pointer",
                  opacity: maxPlayers.error ? 0.5 : 1,
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
                  value={turnTimeSeconds.raw}
                  onChange={turnTimeSeconds.onChange}
                  style={INPUT_STYLE}
                />
              </label>
              {turnTimeSeconds.error && (
                <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>{turnTimeSeconds.error}</div>
              )}

              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                Очки для победы (от 50)
                <input
                  type="number"
                  min={50}
                  value={targetPoints.raw}
                  onChange={targetPoints.onChange}
                  style={INPUT_STYLE}
                />
              </label>
              {targetPoints.error && (
                <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>{targetPoints.error}</div>
              )}

              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                Количество бустеров в наборе (от 1 до {maxPoolSize})
                <input
                  type="number"
                  min={1}
                  max={maxPoolSize}
                  value={boosterSetSize.raw}
                  onChange={boosterSetSize.onChange}
                  style={INPUT_STYLE}
                />
              </label>
              {boosterSetSize.error && (
                <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>{boosterSetSize.error}</div>
              )}
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
              disabled={!!turnTimeSeconds.error || !!targetPoints.error || !!boosterSetSize.error || lobbyPlayers.length < 2}
              onClick={() => {
                if (turnTimeSeconds.error || targetPoints.error || boosterSetSize.error || lobbyPlayers.length < 2) return
                socketClient.createMatch({
                  turnTimeSeconds: turnTimeSeconds.value,
                  targetPoints: targetPoints.value,
                  boosterSetSize: boosterSetSize.value,
                  twitchChannel,
                  maxPlayers: maxPlayers.value,
                })
                setScreen("GAME")
              }}
              style={{
                ...PRIMARY_BUTTON_STYLE,
                marginTop: 20,
                padding: "14px 0",
                width: "100%",
                display: "block",
                cursor: (turnTimeSeconds.error || targetPoints.error || boosterSetSize.error || lobbyPlayers.length < 2) ? "not-allowed" : "pointer",
                opacity: (turnTimeSeconds.error || targetPoints.error || boosterSetSize.error || lobbyPlayers.length < 2) ? 0.5 : 1,
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

              <div style={{
                marginTop: 12,
                maxHeight: 400,
                overflowY: "auto",
                border: "1px solid #f8d407",
                borderRadius: 10,
                background: "#101418",
                display: showBoosterTable ? "block" : "none",
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
                            <img src={`/boosters/${b.icon}.webp`} alt={b.name} style={{ width: 100, height: 100, objectFit: "contain" }} />
                          </td>
                          <td style={{ padding: "6px", fontWeight: 600, whiteSpace: "normal", wordBreak: "break-word" }}>{b.name}</td>
                          <td style={{ padding: "6px", color: "#aaa", lineHeight: "18px" }}>{b.description}</td>
                          <td style={{ padding: "6px", textAlign: "center", fontWeight: 700, color: b.poolCount === 0 ? "#ff6b6b" : "#00ff66" }}>{b.poolCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                🏆 {targetPoints.value}
              </div>

              <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.9 }}>
                Раунд {round}
              </div>

              <div style={{ minWidth: 240 }}>
                <TurnTimer
                  startedAt={currentTurnStartedAt}
                  durationSeconds={turnTimeSeconds.value}
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
            onClose={() => {
              const wasFinished = useGameStore.getState().matchFinished
              useGameStore.setState({ wheelResult: null })
              if (wasFinished) {
                useGameStore.setState({ screen: "RESULT" })
              }
            }}
          />
        )}

        {pandoraResult && (
          <PandoraSpinner
            effects={pandoraResult.effects}
            selectedIndex={pandoraResult.selectedIndex}
            onClose={() => {
              const wasFinished = useGameStore.getState().matchFinished
              useGameStore.setState({ pandoraResult: null })
              if (wasFinished) {
                useGameStore.setState({ screen: "RESULT" })
              }
            }}
          />
        )}
      </>
    )
  }

  return null
}

export default App