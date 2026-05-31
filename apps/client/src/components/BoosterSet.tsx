interface BoosterSnapshot {
  slot: number

  boosterName: string

  boosterIcon: string
}

interface Props {
  boosters: BoosterSnapshot[]
}

export function BoosterSet({
  boosters,
}: Props) {
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
          fontWeight: 700,

          marginBottom: 12,

          fontSize: 16,
        }}
      >
        Booster Set
      </div>

      <div
        style={{
          display: "flex",

          flexDirection:
            "column",

          gap: 10,
        }}
      >
        {boosters.map(
          (booster) => {
            return (
              <div
                key={
                  booster.slot
                }
                style={{
                  background:
                    "#101418",

                  border:
                    "1px solid #2d3742",

                  borderRadius: 10,

                  padding:
                    "10px 12px",

                  display: "flex",

                  alignItems:
                    "center",

                  gap: 12,
                }}
              >
                <div
                  style={{
                    minWidth: 28,

                    height: 28,

                    borderRadius: 8,

                    background:
                      "#2b3542",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    fontWeight: 700,

                    fontSize: 14,
                  }}
                >
                  {
                    booster.slot
                  }
                </div>

                <div
                  style={{
                    width: 64,

                    height: 64,

                    borderRadius: 8,

                    background:
                      "#2b3542",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    overflow:
                      "hidden",

                    flexShrink: 0,
                  }}
                >
                  <img
                    src={`/boosters/${booster.boosterIcon}.png`}
                    alt={
                      booster.boosterName
                    }
                    style={{
                      width: "100%",

                      height: "100%",

                      objectFit:
                        "contain",
                    }}
                  />
                </div>

                <div
                  style={{
                    fontSize: 14,

                    fontWeight: 600,
                  }}
                >
                  {
                    booster.boosterName
                  }
                </div>
              </div>
            )
          }
        )}

        {boosters.length ===
          0 && (
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