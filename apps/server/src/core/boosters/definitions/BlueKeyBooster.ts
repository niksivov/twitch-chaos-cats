import { BoosterDefinition } from "../BoosterTypes"
import { activateKey, BLUE_KEY_ID } from "./keyCombo"

export const BlueKeyBooster: BoosterDefinition = {
  id: BLUE_KEY_ID,

  name: "Голубой ключ",

  description:
    "(Срабатывает с 7 раунда) Если в этом раунде активированы ОБА ключа (голубой и розовый), в живых останутся только их владельцы",

  poolCount: 1,

  icon: "bluekey",

  execute: ({
    match,
    sourcePlayerId,
  }) => {
    activateKey(
      match,
      BLUE_KEY_ID,
      sourcePlayerId
    )
  },
}