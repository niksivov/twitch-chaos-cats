import { avatarPool } from './avatarPool'

export class AvatarManager {
  private usedAvatars =
    new Set<string>()

  assignAvatar(): string {
    const available =
      avatarPool.filter(
        avatar =>
          !this.usedAvatars.has(
            avatar
          )
      )

    let selected: string

    if (available.length > 0) {
      selected =
        available[
          Math.floor(
            Math.random() *
              available.length
          )
        ]
    } else {
      selected =
        avatarPool[
          Math.floor(
            Math.random() *
              avatarPool.length
          )
        ]
    }

    this.usedAvatars.add(
      selected
    )

    return selected
  }

  releaseAvatar(
    avatarId: string
  ) {
    this.usedAvatars.delete(
      avatarId
    )
  }
}