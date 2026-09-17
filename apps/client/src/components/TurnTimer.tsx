import {
  useEffect,
  useState,
} from "react"
import { useGameStore } from "../store/gameStore"
import { t } from "../i18n"

interface Props {
  startedAt?: number

  durationSeconds: number

  playerName?: string
}

export function TurnTimer({
  startedAt,
  durationSeconds,
  playerName,
}: Props) {
  const lang = useGameStore((s) => s.lang)
  const [remaining, setRemaining] =
    useState(durationSeconds)

  useEffect(() => {
    const update = () => {
      if (!startedAt) {
        setRemaining(
          durationSeconds
        )

        return
      }

      const elapsed =
        Math.floor(
          (Date.now() -
            startedAt) /
            1000
        )

      const next =
        Math.max(
          durationSeconds -
            elapsed,
          0
        )

      setRemaining(next)
    }

    update()

    const interval =
      setInterval(update, 250)

    return () => {
      clearInterval(interval)
    }
  }, [
    startedAt,
    durationSeconds,
  ])

  return (
    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 42,

          fontWeight: 800,

          color:
            remaining <= 3
              ? "#ff6666"
              : "#00ff66",

          lineHeight: 1,
        }}
      >
        {remaining}
      </div>

      <div>
        <div
          style={{
            fontSize: 12,

            opacity: 0.65,

            textTransform:
              "uppercase",
          }}
        >
          {t(lang, "turnTimer.playerTurn")}
        </div>

        <div
          style={{
            fontSize: 16,

            fontWeight: 700,

            marginTop: 2,

            maxWidth: 200,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {playerName ??
            t(lang, "turnTimer.waiting")}
        </div>
      </div>
    </div>
  )
}