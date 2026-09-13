import { ALL_BOOSTERS } from "./definitions"
import { BLUE_KEY_ID, PINK_KEY_ID } from "./definitions/keyCombo"

const MAX_POOL_COUNT = 50

const KNOWN_IDS = new Set(ALL_BOOSTERS.map((b) => b.id))

function getMaxPoolCount(id: string): number {
  return id === BLUE_KEY_ID || id === PINK_KEY_ID ? 1 : MAX_POOL_COUNT
}

export function normalizeBoosterPoolConfig(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") return {}

  const result: Record<string, number> = {}

  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!KNOWN_IDS.has(id)) continue

    const num = Math.floor(Number(value))

    if (!Number.isFinite(num)) continue

    result[id] = Math.min(getMaxPoolCount(id), Math.max(0, num))
  }

  return result
}