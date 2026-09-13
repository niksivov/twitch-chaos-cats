import { BoosterDefinition } from "../BoosterTypes"
import { activateKey, PINK_KEY_ID } from "./keyCombo"

export const PinkKeyBooster: BoosterDefinition = {
  id: PINK_KEY_ID,

  name: "Розовый ключ",

  description:
    "(Срабатывает с 7 раунда) Если в этом раунде активированы ОБА ключа (голубой и розовый), в живых останутся только их владельцы",

  poolCount: 1,

  icon: "pinkkey",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    activateKey(
      match,
      PINK_KEY_ID,
      sourcePlayerId
    )
  },
}