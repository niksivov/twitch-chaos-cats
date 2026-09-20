import { useEffect, useState } from "react"
import { useGameStore } from "../store/gameStore"
import { t } from "../i18n"

export function PhaseBanner() {
  const lang = useGameStore((s) => s.lang)
  const phase = useGameStore((s) => s.phase)
  const round = useGameStore((s) => s.round)
  const currentTurnPlayerId = useGameStore((s) => s.currentTurnPlayerId)
  const players = useGameStore((s) => s.players)
  const turnOrder = useGameStore((s) => s.turnOrder)
  const boosterSet = useGameStore((s) => s.boosterSet)

  const [flash, setFlash] = useState<string | null>(null)

  const current = players.find((p) => p.id === currentTurnPlayerId)

  useEffect(() => {
    let text: string | null = null

    if (phase === "WAITING_FOR_PLAYERS") {
      text = t(lang, "banner.waitingJoin")
    } else if (phase === "ROUND_START") {
      text = t(lang, "banner.roundStart", { round })
    } else if (phase === "BOOSTER_RESOLUTION" || phase === "TURN_END") {
      text = t(lang, "banner.resolve")
    } else if (phase === "ROUND_END") {
      text = t(lang, "banner.roundEnd", { round })
    }

    if (!text) {
      setFlash(null)
      return
    }

    setFlash(text)
    const timer = setTimeout(() => setFlash(null), 2500)

    return () => clearTimeout(timer)
  }, [phase, round, lang])

  const isSelecting = phase === "BOOSTER_SELECTION" || phase === "TURN_START"

  let next: string | null = null
  if (currentTurnPlayerId && turnOrder.length > 1) {
    const idx = turnOrder.findIndex((id) => id === currentTurnPlayerId)
    if (idx !== -1) {
      const nextId = turnOrder[(idx + 1) % turnOrder.length]
      next = players.find((p) => p.id === nextId)?.nickname ?? null
    }
  }

  const count = Math.max(1, boosterSet.length)

  const selectionText =
    isSelecting && current
      ? t(lang, "banner.turn", { count, player: current.nickname })
      : null

  if (!flash && !selectionText) return null

  return (
    <div style={{ marginBottom: 16, textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          background: isSelecting && !flash
            ? "linear-gradient(135deg, #f8d407, #ff9800)"
            : "linear-gradient(135deg, #9c27b0, #6a1b9a)",
          color: isSelecting && !flash ? "#1a1f26" : "#ffffff",
          borderRadius: 14,
          padding: "14px 24px",
          fontSize: 20,
          fontWeight: 800,
          maxWidth: "100%",
          boxShadow: "0 0 16px rgba(0,0,0,0.4)",
          animation: isSelecting && !flash ? "pulseHint 1.2s ease-in-out infinite" : undefined,
        }}
      >
        {flash ?? selectionText}
      </div>

      {isSelecting && !flash && next && (
        <div style={{ marginTop: 6, fontSize: 14, opacity: 0.8 }}>
          {t(lang, "banner.next", { player: next })}
        </div>
      )}

      <style>{`
        @keyframes pulseHint {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 212, 7, 0.5); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(248, 212, 7, 0); }
        }
      `}</style>
    </div>
  )
}