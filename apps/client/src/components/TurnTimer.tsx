import {
  useEffect,
  useState,
} from "react"

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
        background:
          "#1a1f26",

        border:
          "1px solid #2d3742",

        borderRadius: 12,

        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 13,

          opacity: 0.7,

          marginBottom: 6,
        }}
      >
        CURRENT TURN
      </div>

      <div
        style={{
          fontSize: 18,

          fontWeight: 700,

          marginBottom: 12,
        }}
      >
        {playerName ??
          "Waiting..."}
      </div>

      <div
        style={{
          fontSize: 40,

          fontWeight: 800,

          color:
            remaining <= 3
              ? "#ff6666"
              : "#00ff66",

          lineHeight: 1,
        }}
      >
        {remaining}s
      </div>
    </div>
  )
}