const COLORS = [
  "#f707e3",
  "#07fded",
  "#fd053b",
  "#07fc27",
  "#f8fc07",
  "#fa7a02",
  "#6e5ff7",
  "#a6ff00",
  "#97c9f1",
  "#ff4800",
  "#f33e5c",
  "#38dd9e",
  "#f33e7d",
  "#110fa0",
  "#147c4c",
  "#945400",
  "#085f6e",
  "#8c3ef3",
  "#fad4bb",
  "#550751",
]

const colorIndexByKey = new Map<string, number>()
const usedIndexes = new Set<number>()

export function getPlayerColor(key: string): string {
  if (!key) return COLORS[0]

  const existing = colorIndexByKey.get(key)
  if (existing !== undefined) return COLORS[existing]

  let idx = 0
  while (usedIndexes.has(idx) && idx < COLORS.length) {
    idx++
  }

  const index = idx % COLORS.length
  usedIndexes.add(index)
  colorIndexByKey.set(key, index)

  return COLORS[index]
}

export function resetPlayerColors(): void {
  colorIndexByKey.clear()
  usedIndexes.clear()
}