const COLORS = [
  "#f707e3",
  "#07fded",
  "#fd053b",
  "#07fc27",
  "#f8fc07",
  "#fa7a02",
  "#3f2afa",
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

export function getPlayerColor(id: string) {
  let hash = 0

  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i)
  }

  return COLORS[hash % COLORS.length]
}