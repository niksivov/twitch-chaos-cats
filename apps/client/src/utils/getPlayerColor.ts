const COLORS = [
  "#fa10e6",
  "#93f7f0",
  "#a19cf1",
  "#9ef5a9",
  "#ebec9e",
  "#eebe90",
  "#a6d3f5",
  "#f0a8c1",
]

export function getPlayerColor(id: string) {
  let hash = 0

  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i)
  }

  return COLORS[hash % COLORS.length]
}