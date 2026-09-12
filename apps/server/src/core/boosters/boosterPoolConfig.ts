import { ALL_BOOSTERS } from "./definitions"

const MAX_POOL_COUNT = 50

const KNOWN_IDS = new Set(ALL_BOOSTERS.map((b) => b.id))

export function normalizeBoosterPoolConfig(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") return {}

  const result: Record<string, number> = {}

  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!KNOWN_IDS.has(id)) continue

    const num = Math.floor(Number(value))

    if (!Number.isFinite(num)) continue

    result[id] = Math.min(MAX_POOL_COUNT, Math.max(0, num))
  }

  return result
}