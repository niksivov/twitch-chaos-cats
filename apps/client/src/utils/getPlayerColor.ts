const COLORS = [
  "#f50303",
  "#02bcfa",
  "#f7f30d",
  "#4bf70d",
  "#b84dff",
  "#ff7ad9",
  "#ff914d",
  "#4dffb8",
  "#4d6bff",
  "#ff4df0",
  "#a6ff4d",
  "#4dfff6",
  "#ff6b4d",
  "#d14dff",
  "#4dff88",
  "#ff4d9a",
  "#4da6ff",
  "#ffe14d",
  "#9dff4d",
  "#00e9fa",
]

// простой детерминированный shuffle (на основе строки)
function shuffle(seed: string) {
  const arr = [...COLORS]

  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0
  }

  // Fisher–Yates shuffle с псевдорандомом
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 16807) % 2147483647
    const j = h % (i + 1)

    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

export function assignPlayerColors(players: { id: string }[]) {
  // seed = состав игроков (важно: одинаковый матч → одинаковый результат)
  const seed = players.map((p) => p.id).join("|")

  const colors = shuffle(seed)

  return players.map((p, i) => ({
    ...p,
    color: colors[i % colors.length],
  }))
}