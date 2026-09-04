import { useEffect, useState, useMemo, useRef } from "react"
import { socketClient } from "../network/socket"

interface PandoraEffect {
  id: number
  label: string
  color: string
}

interface Props {
  effects: PandoraEffect[]
  selectedIndex: number
  onClose: () => void
}

const PANDORA_COLORS = ["#9c27b0", "#c62828"]

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

function Confetti({ count = 50 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 40,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2.5,
      size: 4 + Math.random() * 6,
      color: PANDORA_COLORS[i % 2],
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

export function PandoraSpinner({ effects, selectedIndex, onClose }: Props) {
  const [phase, setPhase] = useState<"spinning" | "done">("spinning")
  const [rotation, setRotation] = useState(0)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const cx = 330
  const cy = 330
  const r = 300
  const innerR = 45

  const segAngle = 360 / effects.length

  const segments = effects.map((effect, i) => ({
    effect,
    startAngle: i * segAngle,
    endAngle: (i + 1) * segAngle,
    color: PANDORA_COLORS[i % 2],
  }))

  useEffect(() => {
    const selected = segments[selectedIndex]
    if (!selected) return

    const segCenter = (selected.startAngle + selected.endAngle) / 2
    const finalAngle = 1080 + (360 - segCenter)
    requestAnimationFrame(() => setRotation(finalAngle))

    const timer = setTimeout(() => setPhase("done"), 10000)
    return () => clearTimeout(timer)
  }, [selectedIndex])

  useEffect(() => {
    if (phase === "done") {
      const timer = setTimeout(() => {
        socketClient.pandoraDone()
        onCloseRef.current()
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const selectedEffect = effects[selectedIndex]

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.90)",
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
          fontSize: 32,
          fontWeight: 900,
          color: "#c62828",
          textShadow: "0 0 16px rgba(198,40,40,0.6), 0 0 40px rgba(198,40,40,0.3)",
          letterSpacing: 2,
        }}
      >
        📦 ЯЩИК ПАНДОРЫ!
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
          viewBox="0 0 660 660"
          width={660}
          height={660}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: phase === "spinning"
              ? "transform 10s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
          }}
        >
          <defs>
            {segments.map((seg, i) => {
              const mid = (seg.startAngle + seg.endAngle) / 2
              const lightPos = polarToCartesian(cx, cy, r * 0.4, mid)
              return (
                <radialGradient key={`grad-${i}`} id={`pandoraGrad-${i}`} cx={`${(lightPos.x / 660) * 100}%`} cy={`${(lightPos.y / 660) * 100}%`} r="60%">
                  <stop offset="0%" stopColor={seg.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={seg.color} stopOpacity="0.6" />
                </radialGradient>
              )
            })}
          </defs>

          {/* Outer ring */}
          <circle cx={cx} cy={cy} r={r + 16} fill="none" stroke="#c62828" strokeWidth="4" opacity="0.5" />
          <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke="#9c27b0" strokeWidth="1.5" opacity="0.3" />

          {/* Tick marks */}
          {segments.map((seg, i) => {
            const outer = polarToCartesian(cx, cy, r + 18, seg.startAngle)
            const inner = polarToCartesian(cx, cy, r + 5, seg.startAngle)
            return (
              <line key={`tick-${i}`} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} stroke={seg.color} strokeWidth="2.5" opacity="0.6" />
            )
          })}

          {/* Segments */}
          {segments.map((seg, i) => {
            const midAngle = (seg.startAngle + seg.endAngle) / 2
            const textPos = polarToCartesian(cx, cy, r * 0.82, midAngle)
            const isSelected = phase === "done" && i === selectedIndex

            return (
              <g
                key={i}
                style={{
                  filter: isSelected
                    ? "drop-shadow(0 0 16px rgba(255,213,79,0.9))"
                    : "none",
                }}
              >
                <path
                  d={describeArc(cx, cy, r, seg.startAngle, seg.endAngle)}
                  fill={`url(#pandoraGrad-${i})`}
                  stroke="#1a1a2e"
                  strokeWidth={3}
                />

                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={22}
                  fontWeight={800}
                  style={{
                    transform: `rotate(${midAngle}deg)`,
                    transformOrigin: `${textPos.x}px ${textPos.y}px`,
                  }}
                >
                  {seg.effect.label}
                </text>
              </g>
            )
          })}

          {/* Center hub */}
          <circle cx={cx} cy={cy} r={innerR + 8} fill="none" stroke="#c62828" strokeWidth="2.5" opacity="0.4" />
          <circle cx={cx} cy={cy} r={innerR} fill="#1a1a2e" stroke="#9c27b0" strokeWidth={4} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#ffd54f" fontSize={36} fontWeight={900}>
            📦
          </text>
        </svg>
      </div>

      {phase === "done" && (
        <>
          <Confetti count={60} />
          {selectedEffect && (
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#ffd54f",
                textShadow: "0 0 20px rgba(255,213,79,0.7), 0 0 40px rgba(255,213,79,0.4)",
                animation: "pulse 0.5s ease-in-out 3",
              }}
            >
              {selectedEffect.label}
            </div>
          )}
        </>
      )}
    </div>
  )
}
