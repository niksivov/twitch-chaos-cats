import { useEffect, useState } from "react"

interface BoosterSnapshot {
  slot: number
  boosterName: string
  boosterIcon: string
}

interface Props {
  boosters: BoosterSnapshot[]
}

type BoosterWithAnim = BoosterSnapshot & {
  state?: "idle" | "removing"
}

export function BoosterSet({ boosters }: Props) {
  const [visibleBoosters, setVisibleBoosters] = useState<BoosterWithAnim[]>(boosters)

  useEffect(() => {
    setVisibleBoosters((prev) => {
      // добавляем новые бустеры
      const nextMap = new Map<number, BoosterSnapshot>()
      boosters.forEach((b) => nextMap.set(b.slot, b))

      const prevMap = new Map<number, BoosterWithAnim>()
      prev.forEach((b) => prevMap.set(b.slot, b))

      const result: BoosterWithAnim[] = []

      // 1. оставляем существующие и обновляем
      prev.forEach((b) => {
        if (nextMap.has(b.slot)) {
          result.push({
            ...nextMap.get(b.slot)!,
            state: "idle",
          })
        } else {
          // 2. если исчез — запускаем анимацию удаления
          result.push({
            ...b,
            state: b.state === "removing" ? "removing" : "removing",
          })
        }
      })

      // 3. добавляем новые
      boosters.forEach((b) => {
        if (!prevMap.has(b.slot)) {
          result.push({
            ...b,
            state: "idle",
          })
        }
      })

      return result
    })
  }, [boosters])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    visibleBoosters.forEach((b) => {
      if (b.state === "removing") {
        const t = setTimeout(() => {
          setVisibleBoosters((prev) =>
            prev.filter((x) => x.slot !== b.slot)
          )
        }, 400)

        timers.push(t)
      }
    })

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [visibleBoosters])

  return (
    <div
      style={{
        background: "rgba(26, 31, 38, 0.0)",
        border: "0px solid #2d3742",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 12,
          fontSize: 16,
        }}
      >
        Бустеры (в свой ход активируй один бустер командой !номербустера)
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 105px)",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {visibleBoosters.map((booster) => {
          const isRemoving = booster.state === "removing"

          return (
            <div
              key={booster.slot}
              style={{
                position: "relative",
                background: "#101418",
                border: "1px solid #f8d407",
                borderRadius: 10,
                width: 100,
                minHeight: 120,
                padding: "14px 6px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,

                transition: "all 0.4s ease",

                opacity: isRemoving ? 0 : 1,
                transform: isRemoving
                  ? "scale(0.75) rotate(-6deg)"
                  : "scale(1)",
                filter: isRemoving
                  ? "brightness(1.8)"
                  : "brightness(1)",
                boxShadow: isRemoving
                  ? "0 0 18px rgba(248,212,7,0.6)"
                  : "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  minWidth: 26,
                  height: 28,
                  padding: "0 8px",
                  borderRadius: 8,
                  background: "#2b3542",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 19,
                  opacity: 0.9,
                }}
              >
                {booster.slot}
              </div>

              <div
                style={{
                  width: 86,
                  height: 86,
                  borderRadius: 8,
                  background: "#2b3542",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`/boosters/${booster.boosterIcon}.png`}
                  alt={booster.boosterName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: "18px",
                  wordBreak: "break-word",
                }}
              >
                {booster.boosterName}
              </div>
            </div>
          )
        })}

        {visibleBoosters.length === 0 && (
          <div
            style={{
              opacity: 0.5,
              fontSize: 13,
            }}
          >
            No boosters yet
          </div>
        )}
      </div>
    </div>
  )
}