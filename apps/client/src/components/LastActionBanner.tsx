import { useEffect, useState } from "react"
import { useGameStore } from "../store/gameStore"
import { pickLang } from "../i18n"

export function LastActionBanner() {
  const lang = useGameStore((s) => s.lang)
  const events = useGameStore((s) => s.recentEvents)
  const latest = events[0]

  const [visible, setVisible] = useState(!!latest)

  useEffect(() => {
    if (!latest) return
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(timer)
  }, [latest?.id])

  if (!latest || !visible) return null

  const text = pickLang(lang, latest.message, latest.messageEn)

  return (
    <div
      key={latest.id}
      style={{
        marginBottom: 16,
        background: "rgba(156, 39, 176, 0.22)",
        border: "1px solid #ce93d8",
        borderRadius: 12,
        padding: "10px 16px",
        fontSize: 16,
        fontWeight: 700,
        color: "#ffffff",
        animation: "actionSlideIn 0.4s ease-out",
      }}
    >
      {text}
    </div>
  )
}