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
    alt: 'File attachment interface for an AI prompt',
    size: 'standard',
  },
  {
    src: '/media-grid/workflow-agents.png',
    alt: 'Workflow agents interface',
    size: 'standard',
  },
  {
    src: '/media-grid/weather.png',
    alt: 'New York weather widget',
    size: 'standard',
  },
  {
    src: '/media-grid/rag-input.png',
    alt: 'AI input with connected models',
    size: 'standard',
  },
  {
    src: '/media-grid/zinda-three-phones.png',
    alt: 'Three OWork mobile screens: shifts, profile, and wallet',
    size: 'widePhones',
    wide: true,
  },
  {
    src: '/media-grid/zinda-onboarding.png',
    alt: 'Zinda onboarding screen',
    size: 'standard',
  },
  {
    src: '/media-grid/chat-attachments.png',
    alt: 'AI chat with attached files and images',
    size: 'standard',
  },
  {
    src: '/media-grid/play-button.png',
    alt: 'Play button with characters and a Telegram icon',
    size: 'wide620',
    wide: true,
  },
  {
    src: '/media-grid/finance-cards.png',
    alt: 'Banking product cards with 3D illustrations',
    size: 'tall',
  },
  {
    src: '/media-grid/vacancy.png',
    alt: 'Senior Go Developer vacancy card',
    size: 'tall',
  },
  {
    src: '/media-grid/crypto-staking.png',
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
