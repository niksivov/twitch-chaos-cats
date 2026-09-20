export type Dict = Record<string, string>

export const ru: Dict = {
  "app.title": "Твич, Хаос и Котики",

  "channelSelect.subtitle": "Выберите канал и максимальное количество игроков",
  "channelSelect.twitchChannel": "Канал Twitch",
  "channelSelect.maxPlayers": "Максимальное количество игроков (от 2 до 20)",
  "channelSelect.next": "Далее",

  "validation.maxPlayers": "Введите целое число от 2 до 20",
  "validation.turnTime": "Введите целое число от 5 до 600",
  "validation.targetPoints": "Введите целое число от 50",
  "validation.boosterSetSize": "Введите целое число от 1 до {max}",

  "settings.title": "Настройки матча",
  "settings.turnTime": "Таймер хода (в секундах, от 5 до 600)",
  "settings.targetPoints": "Очки для победы (от 50)",
  "settings.boosterSetSize": "Количество бустеров в наборе (от 1 до {max})",
  "settings.joinHint": "Напиши в чат !join и присоединяйся. Зарегистрированные игроки ({count}):",
  "settings.waitingForPlayers": "Ожидание игроков в чате...",
  "settings.play": "Играть",
  "settings.howToPlay": "Как играть",
  "settings.allBoosters": "{arrow} Все бустеры ({kinds} видов, {pool} в пуле)",
  "settings.saveHint": "!save = сохранить настройки, !default = вернуться к изначальным настройкам",
  "settings.tableName": "Название",
  "settings.tableDescription": "Описание",
  "settings.tablePool": "Пул",

  "game.howToPlay": "Как играть",
  "game.waitingForMatch": "Ожидание матча...",
  "game.round": "Раунд {round}",
  "game.resetHintBefore": "Команда стримера",
  "game.resetHintAfter": "сбросит текущую игру",
  "game.statusSaved": "Сохранено",
  "game.statusReset": "Возвращено к дефолту",

  "banner.waitingJoin": "👋 Регистрация открыта — напиши !join в чат",
  "banner.roundStart": "🎯 Раунд {round} начался",
  "banner.resolve": "⚡ Бустер применён",
  "banner.roundEnd": "🎉 Раунд {round} завершён",
  "banner.turn": "⏳ Ход {player}: напиши !1…!{count} в чат (или !0 — пропустить)",
  "banner.next": "Далее: {player}",

  "commands.join": "!join — войти в игру",
  "commands.booster": "!N — активировать бустер в свой ход",
  "commands.skip": "!0 — пропустить ход",

  "howToPlay.title": "Как играть?",

  "boosterSet.header": "🗨 В свой ход напиши !1…!{count} в чат (или !0, чтобы пропустить)",
  "boosterSet.empty": "Бустеров пока нет",

  "eventLog.title": "События",
  "eventLog.empty": "Событий пока нет",
  "eventLog.boosterActivated": "⚡ {player} активирует {booster}",
  "eventLog.roundStart": "🎯 Раунд {round} начался",
  "eventLog.winner": "🏆 Победитель: {winner}",

  "result.winner": "🏆 Победитель!",
  "result.byPoints": "Победа по очкам",
  "result.finalRanking": "Финальный рейтинг",
  "result.playAgain": "🎮 Играть снова",

  "pandora.chaos": "ХАОС!",

  "turnTimer.playerTurn": "Ход игрока",
  "turnTimer.waiting": "Ожидание...",

  "wheel.title": "🎰 Колесо Фортуны!",
  "wheel.winner": "🏆 {winner} побеждает!",
}

export const ruHowToPlay: { title: string; body: string }[] = [
  {
    title: "Что это",
    body: "«Твич, Хаос и Котики» — это игра с чатом Твича. Отдельную игру открывать не нужно: всё происходит прямо в чате и на экране стримера. Своим котиком Вы управляете командами в чате.",
  },
  {
    title: "1. Присоединиться",
    body: "Когда стример открыл регистрацию, напишите в чат !join. Вы появитесь в лобби со случайным котиком-аватаром. Можно присоединяться, пока не наберётся нужное число игроков (от 2 до 20).",
  },
  {
    title: "2. Ходы и раунды",
    body: "Игра идёт по раундам. В каждом раунде игроки ходят по очереди — от отстающего к лидеру (у кого меньше очков, ходит раньше). Когда приходит Ваша очередь, экран подсвечивает Вашего котика и запускается таймер хода.",
  },
  {
    title: "3. Бустеры — главное действие",
    body: "В каждом раунде всем игрокам предлагается общий набор бустеров. Чтобы активировать бустер, напишите в чат его номер командой !номербустера (например, !1). Эффект сработает и поменяет очки. Если Вы не успели выбрать бустер до конца таймера — ход просто переходит к следующему игроку.",
  },
  {
    title: "4. Как победить",
    body: "Первым достичь нужного количества очков или остаться последним выжившим котиком.",
  },
  {
    title: "Советы новичку",
    body: "Следите за таймером и выбирайте бустер быстро. Очередь всегда стартует от слабых к сильным — отстающим игрокам проще догнать лидеров через хаотичные бустеры. Хаос — часть игры: читайте ленту событий внизу экрана.",
  },
  {
    title: "Настройка бустеров (для стримера)",
    body: "Перед началом матча на экране настроек разделе «Все бустеры» можно задать, сколько бустеров попадает в общий набор (сколько копий каждого бустера будет в пуле).",
  },
]