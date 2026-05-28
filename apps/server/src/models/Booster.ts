export type BoosterType =
  | 'instant'
  | 'permanent'

export interface Booster {
  id: string

  name: string

  description: string

  type: BoosterType
}