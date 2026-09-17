import { useGameStore } from "../store/gameStore"
import { getHowToPlaySections, t } from "../i18n"

interface HowToPlayModalProps {
  open: boolean
  onClose: () => void
}

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  const lang = useGameStore((s) => s.lang)
  const SECTIONS = getHowToPlaySections(lang)

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.65)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: "100%",
          maxHeight: "82vh",
          overflowY: "auto",
          background: "rgba(26, 31, 38, 0.98)",
          border: "2px solid #6a1b9a",
          borderRadius: 16,
          padding: 24,
          color: "#fff",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 0 24px rgba(156, 39, 176, 0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 900, color: "#e1bee7" }}>
            {t(lang, "howToPlay.title")}
          </div>

          <div
            onClick={onClose}
            style={{
              cursor: "pointer",
              fontSize: 24,
              lineHeight: "24px",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background: "#2b3542",
              color: "#e1bee7",
            }}
          >
            ×
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#ce93d8",
                  marginBottom: 4,
                }}
              >
                {section.title}
              </div>
              <div style={{ fontSize: 15, lineHeight: "22px", color: "#e8e8e8" }}>
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
