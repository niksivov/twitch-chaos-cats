import { useEffect } from "react"

import { socketClient } from "./network/socket"

import { useGameStore } from "./store/gameStore"

import { PlayerCard } from "./components/PlayerCard"

import { EventLog } from "./components/EventLog"

import { BoosterSet } from "./components/BoosterSet"

import { DeveloperPanel } from "./components/DeveloperPanel"

import { TurnTimer } from "./components/TurnTimer"

function App() {
  const connected = useGameStore(
    (state) => state.connected
  )

  const roomId = useGameStore(
    (state) => state.roomId
  )

  const phase = useGameStore(
    (state) => state.phase
  )

  const tick = useGameStore(
    (state) => state.tick
  )

  const round = useGameStore(
    (state) => state.round
  )

  const currentTurnPlayerId =
    useGameStore(
      (state) =>
        state.currentTurnPlayerId
    )

  const currentTurnStartedAt =
    useGameStore(
      (state) =>
        state.currentTurnStartedAt
    )

  const leaderPlayerId =
    useGameStore(
      (state) =>
        state.leaderPlayerId
    )

  const players = useGameStore(
    (state) => state.players
  )

  const recentEvents =
    useGameStore(
      (state) =>
        state.recentEvents
    )

  const boosterSet =
    useGameStore(
      (state) =>
        state.boosterSet
    )

  useEffect(() => {
    socketClient.connect()
  }, [])

  useEffect(() => {
    console.log(
      "PLAYERS STATE:",
      players
    )
  }, [players])

  const currentPlayer =
    players.find(
      (player) =>
        player.id ===
        currentTurnPlayerId
    )

  return (
    <div
      style={{
        minHeight: "100vh",

        background:
          "#101418",

        color: "white",

        padding: 20,

        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 28,

              fontWeight: 800,
            }}
          >
            Twitch Chaos Cats
          </div>

          <div
            style={{
              opacity: 0.7,

              marginTop: 4,
            }}
          >
            Room:
            {" "}
            {roomId}
          </div>
        </div>

        <div
          style={{
            display: "flex",

            gap: 16,

            fontSize: 14,
          }}
        >
          <div>
            Round:
            {" "}
            {round}
          </div>

          <div>
            Phase:
            {" "}
            {phase}
          </div>

          <div>
            Tick:
            {" "}
            {tick}
          </div>

          <div>
            WS:
            {" "}
            {connected
              ? "ONLINE"
              : "OFFLINE"}
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: 16,

          padding: 12,

          borderRadius: 12,

          background:
            "#1a1f26",

          border:
            "1px solid #2d3742",

          fontSize: 13,
        }}
      >
        Players count:
        {" "}
        {players.length}
      </div>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "1fr 320px",

          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fill, minmax(260px, 1fr))",

              gap: 12,
            }}
          >
            {players.map(
              (player) => {
                return (
                  <PlayerCard
                    key={
                      player.id
                    }
                    player={
                      player
                    }
                    isCurrentTurn={
                      player.id ===
                      currentTurnPlayerId
                    }
                    isLeader={
                      player.id ===
                      leaderPlayerId
                    }
                  />
                )
              }
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",

            flexDirection:
              "column",

            gap: 20,
          }}
        >
          <TurnTimer
            startedAt={
              currentTurnStartedAt
            }
            durationSeconds={
              15
            }
            playerName={
              currentPlayer?.nickname
            }
          />

          <BoosterSet
            boosters={
              boosterSet
            }
          />

          <DeveloperPanel
            boosters={
              boosterSet
            }
          />

          <EventLog
            events={
              recentEvents
            }
          />
        </div>
      </div>
    </div>
  )
}

export default App