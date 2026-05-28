export interface BoostCommand {
  type: "BOOST"

  roomId: string

  playerId: string

  slot: number
}