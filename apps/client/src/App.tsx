import { useEffect } from "react"

import { socketClient } from "./network/socket"

import { useGameStore } from "./store/gameStore"

import { PlayerCard } from "./components/PlayerCard"

import { EventLog } from "./components/EventLog"

import { BoosterSet } from "./components/BoosterSet"

import { TurnTimer } from "./components/TurnTimer"

import backgroundImage from "./assets/backgrounds/1.png"

function App() {
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
    <>
      <img
        src={backgroundImage}
        alt=""
        style={{
          position: "fixed",

          inset: 0,

          width: "100%",

          height: "100%",

          objectFit: "cover",

          objectPosition:
            "center",

          zIndex: -2,

          pointerEvents:
            "none",
        }}
      />

      <div
        style={{
          position: "fixed",

          inset: 0,

          background:
            "rgba(0, 0, 0, 0.65)",

          zIndex: -1,

          pointerEvents:
            "none",
        }}
      />

      <div
        style={{
          minHeight: "100vh",

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
              Твич, Хаос и Котики
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "1fr 320px",

            gap: 20,

            marginTop: 20,

            marginBottom: 20,
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

              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                padding: 12,

                borderRadius: 12,

                background:
                  "#1a1f26",

                border:
                  "1px solid #2d3742",
              }}
            >
              <div
                style={{
                  fontSize: 20,

                  fontWeight: 700,

                  opacity: 0.9,
                }}
              >
                Раунд {round}
              </div>

              <div
                style={{
                  width: 180,
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
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginBottom: 20,
          }}
        >
          <BoosterSet
            boosters={
              boosterSet
            }
          />
        </div>

        <div
          style={{
            marginBottom: 20,
          }}
        >
          <EventLog
            events={
              recentEvents
            }
          />
        </div>
      </div>
    </>
  )
}

export default App