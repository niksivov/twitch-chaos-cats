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
          Ход игрока
        </div>

        <div
          style={{
            fontSize: 16,

            fontWeight: 700,

            marginTop: 2,
          }}
        >
          {playerName ??
            "Waiting..."}
        </div>
      </div>
    </div>
  )
}