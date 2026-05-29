interface PlayerSnapshot {
  id: string

  nickname: string

  avatarId: string

  points: number

  eliminated: boolean
}

interface Props {
  player: PlayerSnapshot

  isCurrentTurn: boolean

  isLeader: boolean
}

export function PlayerCard({
  player,
  isCurrentTurn,
  isLeader,
}: Props) {
  return (
    <div
      style={{
        background:
          "#1a1f26",

        border: isCurrentTurn
          ? "2px solid #00ff66"
          : "1px solid #2d3742",

        borderRadius: 12,

        padding: 12,

        opacity:
          player.eliminated
            ? 0.4
            : 1,

        transition:
          "all 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 8,
          }}
        >
          <div
            style={{
              width: 42,

              height: 42,

              borderRadius: 10,

              background:
                "#2b3542",

              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",

              fontSize: 12,

              fontWeight: 700,
            }}
          >
            {player.avatarId}
          </div>

          <div>
            <div
              style={{
                fontWeight: 700,

                fontSize: 15,
              }}
            >
              {player.nickname}
            </div>

            <div
              style={{
                fontSize: 12,

                opacity: 0.7,
              }}
            >
              {player.eliminated
                ? "ELIMINATED"
                : "ALIVE"}
            </div>
          </div>
        </div>

        {isLeader && (
          <div
            style={{
              fontSize: 22,
            }}
          >
            👑
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          fontSize: 13,

          opacity: 0.9,
        }}
      >
        <div>
          Points:
          {" "}
          {player.points}
        </div>

        {isCurrentTurn && (
          <div
            style={{
              color: "#00ff66",

              fontWeight: 700,
            }}
          >
            TURN
          </div>
        )}
      </div>
    </div>
  )
}