import type { Match } from "../../Match"

export const BLUE_KEY_ID = "BLUE_KEY"
export const PINK_KEY_ID = "PINK_KEY"

const MIN_ROUND = 7

export function activateKey(match: Match, keyId: string, playerId: string) {
  if (match.round < MIN_ROUND) return

  match.state.keyComboActivations[keyId] = { playerId, round: match.round }

  const otherKeyId = keyId === BLUE_KEY_ID ? PINK_KEY_ID : BLUE_KEY_ID
  const partner = match.state.keyComboActivations[otherKeyId]

  if (!partner || partner.round !== match.round) return

  match.state.keyComboActivations = {}

  const secondId = playerId
  const firstId = partner.playerId

  const firstPlayer = match.state.registeredPlayers[firstId]

  const survivors = new Set<string>()

  if (firstPlayer?.isAlive) {
    survivors.add(firstId)
  }

  survivors.add(secondId)

  for (const p of Object.values(match.state.registeredPlayers)) {
    if (!survivors.has(p.playerId)) {
      p.isAlive = false
    }
  }

  if (!firstPlayer || !firstPlayer.isAlive) {
    match.winnerId = secondId
  }
}