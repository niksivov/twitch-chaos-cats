import { useEffect, useState, useRef } from "react"
import { useGameStore } from "../store/gameStore"

interface WheelPlayer {
  id: string
  username: string
  avatarId: string
  score: number
  probability: number
}

interface Props {
  players: WheelPlayer[]
  winnerId: string
  onClose: () => void
}

const COLORS = [
  "#9c27b0",
  "#1565c0",
  "#2e7d32",
  "#e65100",
  "#c62828",
  "#00838f",
  "#6a1b9a",
  "#283593",
  "#1b5e20",
  "#bf360c",
]

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return [
    "M", cx, cy,
    "L", start.x, start.y,
    "A", r, r, 0, largeArc, 0, end.x, end.y,
    "Z",
  ].join(" ")
}

export function WheelSpinner({ players, winnerId, onClose }: Props) {
  const [phase, setPhase] = useState<"spinning" | "done">("spinning")
  const [rotation, setRotation] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)

  const cx = 200
  const cy = 200
  const r = 180

  const segments: {
    player: WheelPlayer
    startAngle: number
    endAngle: number
    color: string
  }[] = []

  let currentAngle = 0
  players.forEach((p, i) => {
    const segAngle = p.probability * 360
    segments.push({
      player: p,
      startAngle: currentAngle,
      endAngle: currentAngle + segAngle,
      color: COLORS[i % COLORS.length],
    })
    currentAngle += segAngle
  })

  const winnerSegment = segments.find(
    (s) => s.player.id === winnerId
  )

  useEffect(() => {
    if (!winnerSegment) return

    const segCenter =
      (winnerSegment.startAngle + winnerSegment.endAngle) / 2

    const finalAngle = 1080 + (360 - segCenter)

    requestAnimationFrame(() => {
      setRotation(finalAngle)
    })

    const timer = setTimeout(() => {
      setPhase("done")
    }, 10000)

    return () => clearTimeout(timer)
  }, [winnerSegment])

  useEffect(() => {
    if (phase === "done") {
      const timer = setTimeout(() => {
        useGameStore.setState({ screen: "RESULT", wheelResult: null })
        onClose()
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [phase, onClose])

  const winner = players.find((p) => p.id === winnerId)

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.85)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: "#ffd54f",
          textShadow: "0 0 12px rgba(255,213,79,0.5)",
        }}
      >
        🎰 Колесо Фортуны!
      </div>

      <div style={{ position: "relative", width: 400, height: 400 }}>
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            fontSize: 36,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
        >
          ▼
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 400 400"
          width={400}
          height={400}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition:
              phase === "spinning"
                ? "transform 10s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
          }}
        >
          {segments.map((seg) => {
            const midAngle =
              (seg.startAngle + seg.endAngle) / 2
            const textPos = polarToCartesian(
              cx,
              cy,
              r * 0.6,
              midAngle
            )

            return (
              <g key={seg.player.id}>
                <path
                  d={describeArc(
                    cx,
                    cy,
                    r,
                    seg.startAngle,
                    seg.endAngle
                  )}
                  fill={seg.color}
                  stroke="#1a1a2e"
                  strokeWidth={2}
                />

                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={12}
                  fontWeight={700}
                  style={{
                    transform: `rotate(${midAngle}deg)`,
                    transformOrigin: `${textPos.x}px ${textPos.y}px`,
                  }}
                >
                  {seg.player.username}
                </text>

                <text
                  x={textPos.x}
                  y={textPos.y + 14}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="rgba(255,255,255,0.7)"
                  fontSize={10}
                >
                  {Math.round(seg.player.probability * 100)}%
                </text>
              </g>
            )
          })}

          <circle
            cx={cx}
            cy={cy}
            r={30}
            fill="#1a1a2e"
            stroke="#ffd54f"
            strokeWidth={3}
          />

          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ffd54f"
            fontSize={18}
            fontWeight={900}
          >
            🎰
          </text>
        </svg>
      </div>

      {phase === "done" && winner && (
        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#4cff4c",
            textShadow: "0 0 16px rgba(76,255,76,0.5)",
            animation: "pulse 0.5s ease-in-out 3",
          }}
        >
          🏆 {winner.username} побеждает!
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
        `}
      </style>
    </div>
  )
}
