interface HowToPlayModalProps {
  open: boolean
  onClose: () => void
}

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Что это",
    body: "«Твич, Хаос и Котики» — это игра с чатом Твича. Отдельную игру открывать не нужно: всё происходит прямо в чате и на экране стримера. Своим котиком вы управляете командами в чате.",
  },
  {
    title: "1. Присоединиться",
    body: "Когда стример открыл регистрацию, напишите в чат !join. Вы появитесь в лобби со случайным котиком-аватаром. Можно присоединяться, пока не наберётся нужное число игроков (до 20).",
  },
  {
    title: "2. Ходы и раунды",
    body: "Игра идёт по раундам. В каждом раунде игроки ходят по очереди — от отстающего к лидеру (у кого меньше очков, ходит раньше). Когда приходит ваша очередь, экран подсвечивает вашего котика и запускается таймер хода.",
  },
  {
    title: "3. Бустеры — главное действие",
    body: "В каждом раунде всем игрокам предлагается набор бустеров. Чтобы активировать один, напишите в чат его номер командой !номербустера (например !1). Эффект сработает и поменяет очки. Если не успели выбрать бустер до конца таймера — ход просто переходит к следующему игроку.",
  },
  {
    title: "4. Как победить",
    body: "Первым достичь нужного количества очков или остаться последним выжившим котиком.",
  },
  {
    title: "Советы новичку",
    body: "Следите за таймером и выбирайте бустер быстро. Очередь всегда от слабых к сильным — отстающим проще догнать лидеров через хаотичные бустеры. Хаос — часть игры: читайте ленту событий внизу экрана.",
  },
]

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.65)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: "100%",
          maxHeight: "82vh",
          overflowY: "auto",
          background: "rgba(26, 31, 38, 0.98)",
          border: "2px solid #6a1b9a",
          borderRadius: 16,
          padding: 24,
          color: "#fff",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 0 24px rgba(156, 39, 176, 0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 900, color: "#e1bee7" }}>
            Как играть?
          </div>

          <div
            onClick={onClose}
            style={{
              cursor: "pointer",
              fontSize: 24,
              lineHeight: "24px",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background: "#2b3542",
              color: "#e1bee7",
            }}
          >
            ×
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#ce93d8",
                  marginBottom: 4,
                }}
              >
                {section.title}
              </div>
              <div style={{ fontSize: 15, lineHeight: "22px", color: "#e8e8e8" }}>
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
