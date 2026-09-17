import { useGameStore } from "../store/gameStore"
import type { Lang } from "../i18n"
import type { CSSProperties } from "react"

interface Props {
  style?: CSSProperties
}

const LANGS: Lang[] = ["ru", "en"]

export function LangSwitch({ style }: Props) {
  const lang = useGameStore((s) => s.lang)
  const setLang = useGameStore((s) => s.setLang)

  return (
    <div
      style={{
        display: "inline-flex",
        border: "1px solid #9575cd",
        borderRadius: 10,
        overflow: "hidden",
        background: "#11161d",
        ...style,
      }}
    >
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          style={{
            padding: "6px 14px",
            border: "none",
            background:
              lang === code
                ? "linear-gradient(135deg, #9c27b0, #6a1b9a)"
                : "transparent",
            color: lang === code ? "white" : "#e1bee7",
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          {code}
        </button>
      ))}
    </div>
  )
}