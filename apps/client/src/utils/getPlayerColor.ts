const COLORS = [
  "#dd0dcc",
  "#0ff0e1",
  "#4e43e7",
  "#0d9b20",
  "#e5e914",
  "#f37f13",
  "#74c0fc",
  "#fa1263",
]

export function getPlayerColor(id: string) {
  let hash = 0

  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i)
  }

  return COLORS[hash % COLORS.length]
}