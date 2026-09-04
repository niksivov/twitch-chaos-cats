import { useEffect, useState, useRef, useMemo } from "react"
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
  { base: "#9c27b0", glow: "rgba(156,39,176,0.7)" },
  { base: "#1565c0", glow: "rgba(21,101,192,0.7)" },
  { base: "#2e7d32", glow: "rgba(46,125,50,0.7)" },
  { base: "#e65100", glow: "rgba(230,81,0,0.7)" },
  { base: "#c62828", glow: "rgba(198,40,40,0.7)" },
  { base: "#00838f", glow: "rgba(0,131,143,0.7)" },
  { base: "#6a1b9a", glow: "rgba(106,27,154,0.7)" },
  { base: "#283593", glow: "rgba(40,53,147,0.7)" },
  { base: "#1b5e20", glow: "rgba(27,94,32,0.7)" },
  { base: "#bf360c", glow: "rgba(191,54,12,0.7)" },
]

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return ["M", cx, cy, "L", start.x, start.y, "A", r, r, 0, largeArc, 0, end.x, end.y, "Z"].join(" ")
}

function Confetti({ count = 60 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 40,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 4 + Math.random() * 6,
      color: COLORS[i % COLORS.length].base,
      rotation: Math.random() * 360,
    }))
  }, [count])

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1001, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            borderRadius: p.size > 7 ? "50%" : 1,
            background: p.color,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export function WheelSpinner({ players, winnerId, onClose }: Props) {
  const [phase, setPhase] = useState<"spinning" | "done">("spinning")
  const [rotation, setRotation] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)

  const cx = 330
  const cy = 330
  const r = 300
  const innerR = 45

  const segments: { player: WheelPlayer; startAngle: number; endAngle: number; color: typeof COLORS[0] }[] = []
  let currentAngle = 0
  players.forEach((p, i) => {
    const segAngle = p.probability * 360
    segments.push({ player: p, startAngle: currentAngle, endAngle: currentAngle + segAngle, color: COLORS[i % COLORS.length] })
    currentAngle += segAngle
  })

  const winnerSegment = segments.find((s) => s.player.id === winnerId)

  useEffect(() => {
    if (!winnerSegment) return
    const segCenter = (winnerSegment.startAngle + winnerSegment.endAngle) / 2
    const finalAngle = 1080 + (360 - segCenter)
    requestAnimationFrame(() => setRotation(finalAngle))
    const timer = setTimeout(() => setPhase("done"), 10000)
    return () => clearTimeout(timer)
  }, [winnerSegment])

  useEffect(() => {
    if (phase === "done") {
      const timer = setTimeout(() => {
        useGameStore.setState({ screen: "RESULT", wheelResult: null })
        onClose()
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [phase, onClose])

  const winner = players.find((p) => p.id === winnerId)
  const gradId = "segGrad"

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.88)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
        @keyframes spinPulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.2); }
        }
      `}</style>

      <div
        style={{
          fontSize: 30,
          fontWeight: 900,
          color: "#ffd54f",
          textShadow: "0 0 16px rgba(255,213,79,0.6), 0 0 40px rgba(255,213,79,0.3)",
          letterSpacing: 2,
        }}
      >
        🎰 Колесо Фортуны!
      </div>

      <div style={{ position: "relative", width: 660, height: 660 }}>
        {/* Arrow */}
        <div
          style={{
            position: "absolute",
            top: -20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderTop: "40px solid #ffd54f",
            filter: "drop-shadow(0 0 10px rgba(255,213,79,0.8)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
            animation: phase === "spinning" ? "spinPulse 0.3s ease-in-out infinite" : "none",
          }}
        />

        <svg
          ref={svgRef}
          viewBox="0 0 660 660"
          width={660}
          height={660}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: phase === "spinning"
              ? "transform 10s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
            filter: phase === "done" ? "url(#winnerGlowFilter)" : "none",
          }}
        >
          <defs>
            <filter id="winnerGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
              <feFlood floodColor="#ffd54f" floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {segments.map((seg, i) => {
              const mid = (seg.startAngle + seg.endAngle) / 2
              const lightPos = polarToCartesian(cx, cy, r * 0.4, mid)
              return (
                <radialGradient key={`grad-${i}`} id={`${gradId}-${i}`} cx={`${(lightPos.x / 660) * 100}%`} cy={`${(lightPos.y / 660) * 100}%`} r="60%">
                  <stop offset="0%" stopColor={seg.color.base} stopOpacity="1" />
                  <stop offset="100%" stopColor={seg.color.base} stopOpacity="0.65" />
                </radialGradient>
              )
            })}

            <radialGradient id="centerGrad" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#2a2a4a" />
              <stop offset="100%" stopColor="#1a1a2e" />
            </radialGradient>
          </defs>

          {/* Outer decorative ring */}
          <circle cx={cx} cy={cy} r={r + 16} fill="none" stroke="#ffd54f" strokeWidth="4" opacity="0.5" />
          <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke="#ffd54f" strokeWidth="1.5" opacity="0.3" />

          {/* Tick marks */}
          {segments.map((seg, i) => {
            const outer = polarToCartesian(cx, cy, r + 18, seg.startAngle)
            const inner = polarToCartesian(cx, cy, r + 5, seg.startAngle)
            return (
              <line key={`tick-${i}`} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} stroke="#ffd54f" strokeWidth="2.5" opacity="0.6" />
            )
          })}

          {/* Segments */}
          {segments.map((seg, i) => {
            const midAngle = (seg.startAngle + seg.endAngle) / 2
            const textPos = polarToCartesian(cx, cy, r * 0.55, midAngle)
            const isWinner = phase === "done" && seg.player.id === winnerId

            return (
              <g
                key={seg.player.id}
                style={{
                  filter: isWinner
                    ? "drop-shadow(0 0 16px rgba(255,213,79,0.9))"
                    : `drop-shadow(0 0 4px ${seg.color.glow})`,
                }}
              >
                <path
                  d={describeArc(cx, cy, r, seg.startAngle, seg.endAngle)}
                  fill={`url(#${gradId}-${i})`}
                  stroke="#1a1a2e"
                  strokeWidth={3}
                />

                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={33}
                  fontWeight={800}
                  style={{
                    transform: `rotate(${midAngle}deg)`,
                    transformOrigin: `${textPos.x}px ${textPos.y}px`,
                  }}
                >
                  {seg.player.username}
                </text>
              </g>
            )
          })}

          {/* Center hub */}
          <circle cx={cx} cy={cy} r={innerR + 8} fill="none" stroke="#ffd54f" strokeWidth="2.5" opacity="0.4" />
          <circle cx={cx} cy={cy} r={innerR} fill="url(#centerGrad)" stroke="#ffd54f" strokeWidth={4} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#ffd54f" fontSize={36} fontWeight={900}>
            🎰
          </text>
        </svg>
      </div>

      {phase === "done" && (
        <>
          <Confetti count={70} />
          {winner && (
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#ffd54f",
                textShadow: "0 0 20px rgba(255,213,79,0.7), 0 0 40px rgba(255,213,79,0.4)",
                animation: "pulse 0.5s ease-in-out 3",
              }}
            >
              🏆 {winner.username} побеждает!
            </div>
          )}
        </>
      )}
    </div>
  )
}
