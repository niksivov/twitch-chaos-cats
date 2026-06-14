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
          "rgba(26, 31, 38, 0.0)",

        border:
          "0px solid #2d3742",

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

          gridTemplateColumns:
            "repeat(auto-fill, 105px)",

          justifyContent:
            "center",

          gap: 12,
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
                  position:
                    "relative",

                  background:
                    "#101418",

                  border:
                    "1px solid #f8d407",

                  borderRadius: 10,

                  width: 100,

                  minHeight: 120,

                  padding:
                    "14px 6px 6px",

                  display: "flex",

                  flexDirection:
                    "column",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  gap: 4,
                }}
              >
                <div
                  style={{
                    position:
                      "absolute",

                    top: 8,

                    left: 8,

                    minWidth: 26,

                    height: 26,

                    padding:
                      "0 8px",

                    borderRadius: 8,

                    background:
                      "#2b3542",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    fontWeight: 700,

                    fontSize: 17,

                    opacity: 0.9,
                  }}
                >
                  {
                    booster.slot
                  }
                </div>

                <div
                  style={{
                    width: 86,

                    height: 86,

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
                    textAlign:
                      "center",

                    fontSize: 11,

                    fontWeight: 600,

                    lineHeight:
                      "18px",

                    wordBreak:
                      "break-word",
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