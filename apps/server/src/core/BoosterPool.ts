import { Booster } from '../models/Booster'

export class BoosterPool {
  private boosters: Booster[] = []

  constructor() {
    this.bootstrap()
  }

  bootstrap() {
    this.boosters = [
      {
        id: 'plus_20',
        name: '+20 points',
        description: 'Get 20 points',
        type: 'instant'
      },

      {
        id: 'plus_20',
        name: '+20 points',
        description: 'Get 20 points',
        type: 'instant'
      },

      {
        id: 'plus_20',
        name: '+20 points',
        description: 'Get 20 points',
        type: 'instant'
      },

      {
        id: 'steal_15',
        name: 'Steal 15',
        description: 'Steal 15 points from leader',
        type: 'instant'
      },

      {
        id: 'steal_15',
        name: 'Steal 15',
        description: 'Steal 15 points from leader',
        type: 'instant'
      },

      {
        id: 'swap',
        name: 'Swap',
        description: 'Swap points with leader',
        type: 'instant'
      },

      {
        id: 'fast_thinker',
        name: 'Fast Thinker',
        description:
          'Get points for saved seconds',
        type: 'permanent'
      },

      {
        id: 'shield',
        name: 'Shield',
        description: 'Block next negative effect',
        type: 'permanent'
      }
    ]
  }

  generateSet(size: number) {
    const shuffled = [...this.boosters].sort(
      () => Math.random() - 0.5
    )

    return shuffled.slice(
      0,
      Math.min(size, shuffled.length)
    )
  }

  removeBooster(booster: Booster) {
    const index = this.boosters.findIndex(
      b =>
        b.id === booster.id &&
        b.name === booster.name
    )

    if (index === -1) {
      return
    }

    this.boosters.splice(index, 1)
  }

  returnBoosters(boosters: Booster[]) {
    this.boosters.push(...boosters)
  }

  isEmpty() {
    return this.boosters.length === 0
  }

  getRemainingBoosters() {
    return this.boosters.length
  }

  printPool() {
    console.log('')
    console.log(
      `Boosters left in pool: ${this.boosters.length}`
    )

    console.log('')
  }
}