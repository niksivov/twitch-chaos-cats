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
import { LangSwitch } from "./components/LangSwitch"
import { pickLang, t } from "./i18n"

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

const KEY_BOOSTER_IDS = new Set(["BLUE_KEY", "PINK_KEY"])

function maxPoolCountFor(id: string): number {
  return KEY_BOOSTER_IDS.has(id) ? 1 : 50
}

function App() {
  const screen = useGameStore((s) => s.screen)
  const setScreen = useGameStore((s) => s.setScreen)

  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showBoosterTable, setShowBoosterTable] = useState(false)
  const boosterCatalog = useGameStore((s) => s.boosterCatalog)
  const boosterPoolStatus = useGameStore((s) => s.boosterPoolStatus)
  const [poolDraft, setPoolDraft] = useState<Record<string, number>>({})
  const [prevCatalog, setPrevCatalog] = useState(boosterCatalog)

  if (prevCatalog !== boosterCatalog) {
    setPrevCatalog(boosterCatalog)
    const next: Record<string, number> = {}
    for (const b of boosterCatalog) next[b.id] = Math.min(maxPoolCountFor(b.id), b.poolCount)
    setPoolDraft(next)
  }

  const draftPoolSize = Object.values(poolDraft).reduce((sum, n) => sum + n, 0) || 1
  const maxPoolSize = draftPoolSize

  const lang = useGameStore((s) => s.lang)

  const maxPlayers = useValidatedNumericInput("maxPlayers", 2, 20, t(lang, "validation.maxPlayers"))
  const turnTimeSeconds = useValidatedNumericInput("turnTimeSeconds", 5, 600, t(lang, "validation.turnTime"))
  const targetPoints = useValidatedNumericInput("targetPoints", 50, Infinity, t(lang, "validation.targetPoints"))
  const boosterSetSize = useValidatedNumericInput("boosterSetSize", 1, maxPoolSize, t(lang, "validation.boosterSetSize", { max: maxPoolSize }))

  useEffect(() => {
    if (maxPlayers.error) return
    socketClient.setMaxPlayers(maxPlayers.value)
  }, [maxPlayers.value, maxPlayers.error])

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
        <LangSwitch style={{ position: "fixed", top: 16, left: 16, zIndex: 5 }} />

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
              {t(lang, "app.title")}
            </div>

            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: "center", color: "#d1c4e9" }}>
              {t(lang, "channelSelect.subtitle")}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                {t(lang, "channelSelect.twitchChannel")}
                <input
                  type="text"
                  value={twitchChannel}
                  onChange={(e) => useGameStore.setState({ twitchChannel: e.target.value })}
                  style={INPUT_STYLE}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                {t(lang, "channelSelect.maxPlayers")}
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
                {t(lang, "channelSelect.next")}
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
                {t(lang, "settings.howToPlay")}
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
        <LangSwitch style={{ position: "fixed", top: 16, left: 16, zIndex: 5 }} />

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
              {t(lang, "settings.title")}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 16 }}>
                {t(lang, "settings.turnTime")}
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
                {t(lang, "settings.targetPoints")}
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
                {t(lang, "settings.boosterSetSize", { max: maxPoolSize })}
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
                {t(lang, "settings.joinHint", { count: lobbyPlayers.length })}
              </div>

              {lobbyPlayers.length === 0 && (
                <div style={{ color: "#ccc" }}>{t(lang, "settings.waitingForPlayers")}</div>
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
              {t(lang, "settings.play")}
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
                {t(lang, "settings.howToPlay")}
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
                {t(lang, "settings.allBoosters", {
                  arrow: showBoosterTable ? "▲" : "▼",
                  kinds: boosterCatalog.length,
                  pool: draftPoolSize,
                })}
              </div>

              {showBoosterTable && (
                <>
              {/* ==================== ВАРИАНТ Б (закомментирован): КНОПКИ ====================
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => socketClient.saveBoosterPool()}
                  style={{
                    ...PRIMARY_BUTTON_STYLE,
                    padding: "10px 20px",
                    fontSize: 14,
                  }}
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => socketClient.resetBoosterPool()}
                  style={{
                    ...PRIMARY_BUTTON_STYLE,
                    padding: "10px 20px",
                    fontSize: 14,
                  }}
                >
                  Сбросить к дефолту
                </button>
              </div>
              ====================================================================== */}

              {/* ==================== ВАРИАНТ А (активен): ТВИЧ-КОМАНДЫ ==================== */}
              <div style={{ marginTop: 8, textAlign: "center", color: "white", fontSize: 12 }}>
                {t(lang, "settings.saveHint")}
              </div>
              {/* ====================================================================== */}

              {boosterPoolStatus && (
                <div style={{ marginTop: 6, textAlign: "center", color: "#00ff66", fontSize: 13, fontWeight: 700 }}>
                  ✓ {boosterPoolStatus === "SAVED" ? t(lang, "game.statusSaved") : t(lang, "game.statusReset")}
                </div>
              )}
                </>
              )}

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
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "#ffd54a", borderBottom: "1px solid #2d3742", width: 110 }}>{t(lang, "settings.tableName")}</th>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "#ffd54a", borderBottom: "1px solid #2d3742" }}>{t(lang, "settings.tableDescription")}</th>
                        <th style={{ padding: "8px 6px", textAlign: "center", color: "#ffd54a", borderBottom: "1px solid #2d3742", width: 50 }}>{t(lang, "settings.tablePool")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boosterCatalog.map((b) => (
                        <tr key={b.id} style={{ borderBottom: "1px solid #1a1f26" }}>
                          <td style={{ padding: "6px", textAlign: "center" }}>
                            <img src={`/boosters/${b.icon}.webp`} alt={pickLang(lang, b.name, b.nameEn)} style={{ width: 100, height: 100, objectFit: "contain" }} />
                          </td>
                          <td style={{ padding: "6px", fontWeight: 600, whiteSpace: "normal", wordBreak: "break-word" }}>{pickLang(lang, b.name, b.nameEn)}</td>
                          <td style={{ padding: "6px", color: "white", lineHeight: "18px" }}>{pickLang(lang, b.description, b.descriptionEn)}</td>
                          <td style={{ padding: "6px", textAlign: "center", fontWeight: 700 }}>
                            <input
                              type="number"
                              min={0}
                              max={maxPoolCountFor(b.id)}
                              value={poolDraft[b.id] ?? b.poolCount}
                              onChange={(e) => {
                                const raw = e.target.value
                                const n = Math.floor(Number(raw))
                                const value = raw.trim() === "" ? 0 : Number.isFinite(n) ? Math.min(maxPoolCountFor(b.id), Math.max(0, n)) : (poolDraft[b.id] ?? b.poolCount)
                                setPoolDraft((prev) => ({ ...prev, [b.id]: value }))
                                socketClient.setBoosterPoolDraft({ ...poolDraft, [b.id]: value })
                              }}
                              style={{
                                width: 50,
                                textAlign: "center",
                                padding: "4px 2px",
                                borderRadius: 6,
                                border: "1px solid #2d3742",
                                background: "#11161d",
                                color: (poolDraft[b.id] ?? b.poolCount) === 0 ? "#ff6b6b" : "#00ff66",
                                fontWeight: 700,
                                outline: "none",
                              }}
                            />
                          </td>
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
          pandoraResult: null,
          wheelResult: null,
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
          {t(lang, "game.waitingForMatch")}
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
            <div style={{ fontSize: 28, fontWeight: 800 }}>{t(lang, "app.title")}</div>

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
                {t(lang, "game.round", { round })}
              </div>

              <div style={{ minWidth: 240 }}>
                <TurnTimer
                  startedAt={currentTurnStartedAt}
                  durationSeconds={turnTimeSeconds.value}
                  playerName={currentPlayer?.nickname}
                />
              </div>

              <LangSwitch style={{ flexShrink: 0 }} />

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
                {t(lang, "game.howToPlay")}
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
            {t(lang, "game.resetHintBefore")} <code style={{
              color: "#ffd54a",
              background: "linear-gradient(135deg, #9c27b0, #6a1b9a)",
              padding: "2px 8px",
              borderRadius: 6,
            }}>!reset</code> {t(lang, "game.resetHintAfter")}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            {orderedPlayers.map((player) => (
              <PlayerCard
                key={player.id ?? player.nickname ?? `${player.nickname}-${player.avatarId}`}
                player={player}
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