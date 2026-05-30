import { socketClient } from "../network/socket"

interface Props {
  boosters: {
    slot: number
    boosterName: string
  }[]
}

export function DeveloperPanel({
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
        Developer Panel
      </div>

      <div
        style={{
          display: "flex",

          flexDirection:
            "column",

          gap: 8,
        }}
      >
        {boosters.map(
          (booster) => (
            <button
              key={
                booster.slot
              }
              onClick={() =>
                socketClient.selectBooster(
                  booster.slot
                )
              }
              style={{
                padding:
                  "10px 12px",

                borderRadius: 8,

                border:
                  "1px solid #2d3742",

                background:
                  "#2b3542",

                color:
                  "white",

                cursor:
                  "pointer",
              }}
            >
              Pick{" "}
              {booster.slot}
              {" — "}
              {
                booster.boosterName
              }
            </button>
          )
        )}
      </div>
    </div>
  )
}