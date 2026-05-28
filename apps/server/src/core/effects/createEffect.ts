import { Effect } from "./Effect"

export function createEffect(
  id: string,
  name: string,
  remainingTurns: number
): Effect {
  return {
    id,

    name,

    remainingTurns,
  }
}