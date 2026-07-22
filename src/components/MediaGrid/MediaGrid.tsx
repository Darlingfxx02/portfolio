import styles from './MediaGrid.module.css'

type MediaSlot = {
  src: string
  alt: string
  size: 'standard' | 'tall' | 'short' | 'widePhones' | 'wide620'
  wide?: boolean
}

const slots: MediaSlot[] = [
  {
    src: '/media-grid/attachments.png',
    alt: 'Интерфейс прикрепления файлов к AI-запросу',
    size: 'standard',
  },
  {
    src: '/media-grid/workflow-agents.png',
    alt: 'Интерфейс Workflow Агентов',
    size: 'standard',
  },
  {
    src: '/media-grid/weather.png',
    alt: 'Погодный виджет для Нью-Йорка',
    size: 'standard',
  },
  {
    src: '/media-grid/rag-input.png',
    alt: 'Поле ввода с подключёнными AI-моделями',
    size: 'standard',
  },
  {
    src: '/media-grid/zinda-three-phones.png',
    alt: 'Три мобильных экрана Zinda: смены, профиль и кошелёк',
    size: 'widePhones',
    wide: true,
  },
  {
    src: '/media-grid/zinda-onboarding.png',
    alt: 'Экран онбординга Zinda',
    size: 'standard',
  },
  {
    src: '/media-grid/chat-attachments.png',
    alt: 'AI-чат с прикреплёнными файлами и изображениями',
    size: 'standard',
  },
  {
    src: '/media-grid/play-button.png',
    alt: 'Игровая кнопка Play с персонажами и иконкой Telegram',
    size: 'wide620',
    wide: true,
  },
  {
    src: '/media-grid/finance-cards.png',
    alt: 'Карточки банковских продуктов с 3D-иллюстрациями',
    size: 'tall',
  },
  {
    src: '/media-grid/vacancy.png',
    alt: 'Карточка вакансии Senior Go Developer',
    size: 'tall',
  },
  {
    src: '/media-grid/crypto-staking.png',
    alt: 'Интерфейс криптовалютного стейкинга и наград',
    size: 'wide620',
    wide: true,
  },
]

export function MediaGrid() {
  return (
    <section className={styles.grid} aria-label="Selected media">
      {slots.map((slot) => (
        <div
          key={slot.src}
          className={`${styles.slot} ${styles[slot.size]} ${slot.wide ? styles.wide : ''}`}
        >
          <img src={slot.src} alt={slot.alt} draggable={false} />
        </div>
      ))}
    </section>
  )
}
