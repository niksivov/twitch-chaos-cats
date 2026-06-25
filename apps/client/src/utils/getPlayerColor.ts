const COLORS = [
  "#f707e3",
  "#07fded",
  "#fd053b",
  "#07fc27",
  "#f8fc07",
  "#fa7a02",
  "#03e5f5",
  "#f33e7d",
]

export function getPlayerColor(id: string) {
  let hash = 0

  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i)
  }

  return COLORS[hash % COLORS.length]
}