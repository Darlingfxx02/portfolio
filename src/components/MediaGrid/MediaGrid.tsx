import styles from './MediaGrid.module.css'

type MediaSlot = {
  src: string
  alt: string
  size: 'standard' | 'tall' | 'short' | 'widePhones' | 'wide620'
  wide?: boolean
}

const slots: MediaSlot[] = [
  {
    src: '/media-grid/attachments.png?v=20260722-1',
    alt: 'File attachment interface for an AI prompt',
    size: 'standard',
  },
  {
    src: '/media-grid/workflow-agents.png?v=20260722-1',
    alt: 'Workflow agents interface',
    size: 'standard',
  },
  {
    src: '/media-grid/agentic-flows-chat.png?v=20260723-1',
    alt: 'Agentic flows in chat UI element demo',
    size: 'standard',
  },
  {
    src: '/media-grid/weather.png?v=20260722-1',
    alt: 'New York weather widget',
    size: 'standard',
  },
  {
    src: '/media-grid/life-log-phone.png?v=20260722-1',
    alt: 'Personal life log mobile app with visual collections',
    size: 'standard',
  },
  {
    src: '/media-grid/rag-input.png?v=20260722-1',
    alt: 'AI input with connected models',
    size: 'standard',
  },
  {
    src: '/media-grid/zinda-onboarding.png?v=20260722-1',
    alt: 'Zinda onboarding screen',
    size: 'standard',
  },
  {
    src: '/media-grid/owork-three-phones.png?v=20260722-2',
    alt: 'Three OWork mobile screens: shifts, profile, and wallet',
    size: 'widePhones',
    wide: true,
  },
  {
    src: '/media-grid/chat-attachments.png?v=20260722-1',
    alt: 'AI chat with attached files and images',
    size: 'standard',
  },
  {
    src: '/media-grid/caffeine-tracker-phone.png?v=20260722-1',
    alt: 'Daily caffeine tracker mobile app',
    size: 'standard',
  },
  {
    src: '/media-grid/play-button.png?v=20260722-1',
    alt: 'Play button with characters and a Telegram icon',
    size: 'wide620',
    wide: true,
  },
  {
    src: '/media-grid/finance-cards.png?v=20260722-1',
    alt: 'Banking product cards with 3D illustrations',
    size: 'tall',
  },
  {
    src: '/media-grid/vacancy.png?v=20260722-1',
    alt: 'Senior Go Developer vacancy card',
    size: 'tall',
  },
  {
    src: '/media-grid/crypto-staking.png?v=20260722-1',
    alt: 'Crypto staking and rewards interface',
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
