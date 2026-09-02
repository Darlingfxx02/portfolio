import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { t, useLang, type Loc } from '@/lib/i18n'
import styles from './MediaGrid.module.css'

type MediaSlot = {
  src: string
  alt: Loc
  size:
    | 'standard'
    | 'landscape'
    | 'tall'
    | 'short'
    | 'widePhones'
    | 'wide620'
    | 'wideKyc'
  wide?: boolean
}

type CardRect = {
  top: number
  left: number
  width: number
  height: number
}

const cardRatios: Record<MediaSlot['size'], number> = {
  standard: 839 / 620,
  landscape: 4 / 3,
  tall: 839 / 660,
  short: 839 / 382,
  widePhones: 1708 / 1074.583,
  wide620: 1708 / 620,
  wideKyc: 3309 / 1475,
}

const cardMotion = {
  duration: 460,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  fill: 'both' as const,
}

const slots: MediaSlot[] = [
  {
    src: '/media-grid/crypto-wallet-swap.jpg?v=20260729-1',
    alt: { ru: 'Мобильные интерфейсы криптокошелька и обмена активов', en: 'Crypto wallet and asset swap mobile interfaces' },
    size: 'landscape',
  },
  {
    src: '/media-grid/pink-onboarding.avif?v=20260825-1',
    alt: { ru: 'Стартовый экран розового мобильного онбординга', en: 'Pink mobile onboarding start screen' },
    size: 'landscape',
  },
  {
    src: '/media-grid/pink-onboarding.avif?v=20260825-1',
    alt: { ru: 'Стартовый экран розового мобильного онбординга', en: 'Pink mobile onboarding start screen' },
    size: 'landscape',
  },
  {
    src: '/media-grid/midnight-mix-recap.png?v=20260812-1',
    alt: { ru: 'Концепт мобильного социального recap Midnight Mix', en: 'Midnight Mix mobile social recap concept' },
    size: 'landscape',
  },
  {
    src: '/media-grid/appearance-card-settings.png?v=20260812-1',
    alt: { ru: 'Интерфейс настройки внешнего вида карты', en: 'Card appearance settings interface' },
    size: 'landscape',
  },
  {
    src: '/media-grid/music-carousel.avif?v=20260731-1',
    alt: { ru: 'Перспективная карусель альбомов с управлением плеером', en: 'Perspective album carousel with music player controls' },
    size: 'landscape',
  },
  {
    src: '/media-grid/birthday-message.avif?v=20260731-3',
    alt: { ru: 'Концепт уведомления с поздравлением', en: 'Birthday message notification concept' },
    size: 'landscape',
  },
  {
    src: '/media-grid/kyc-flow.avif?v=20260731-1',
    alt: { ru: 'KYC-сценарий подтверждения личности из трёх экранов', en: 'Three-screen KYC identity verification flow' },
    size: 'wideKyc',
    wide: true,
  },
  {
    src: '/media-grid/creative-quest.avif?v=20260825-1',
    alt: { ru: 'Экран завершения задания Creative Quest', en: 'Creative Quest challenge completion screen' },
    size: 'landscape',
  },
  {
    src: '/media-grid/trip-planner.avif?v=20260825-1',
    alt: { ru: 'Концепт интерфейса реакций в планировщике поездок', en: 'Trip planner reaction interface concept' },
    size: 'landscape',
  },
  {
    src: '/media-grid/file-sharing-upload.jpg?v=20260729-1',
    alt: { ru: 'Мобильный интерфейс загрузки и обмена файлами', en: 'Mobile file sharing upload interface' },
    size: 'landscape',
  },
  {
    src: '/media-grid/orders-dashboard.avif?v=20260825-1',
    alt: { ru: 'Дашборд управления заказами', en: 'Orders administration dashboard' },
    size: 'landscape',
  },
  {
    src: '/media-grid/attachments.png?v=20260722-1',
    alt: { ru: 'Интерфейс прикрепления файлов к AI-промпту', en: 'File attachment interface for an AI prompt' },
    size: 'standard',
  },
  {
    src: '/media-grid/workflow-agents.png?v=20260722-1',
    alt: { ru: 'Интерфейс workflow-агентов', en: 'Workflow agents interface' },
    size: 'standard',
  },
  {
    src: '/media-grid/agentic-flows-chat.png?v=20260723-1',
    alt: { ru: 'Демонстрация агентных сценариев в интерфейсе чата', en: 'Agentic flows in chat UI element demo' },
    size: 'standard',
  },
  {
    src: '/media-grid/rag-input.png?v=20260722-1',
    alt: { ru: 'Поле AI-ввода с подключёнными моделями', en: 'AI input with connected models' },
    size: 'standard',
  },
  {
    src: '/media-grid/zinda-onboarding.png?v=20260722-1',
    alt: { ru: 'Экран онбординга Zinda', en: 'Zinda onboarding screen' },
    size: 'standard',
  },
  {
    src: '/media-grid/chat-attachments.png?v=20260722-1',
    alt: { ru: 'AI-чат с прикреплёнными файлами и изображениями', en: 'AI chat with attached files and images' },
    size: 'standard',
  },
  {
    src: '/media-grid/owork-three-phones.png?v=20260722-2',
    alt: { ru: 'Три мобильных экрана OWork: смены, профиль и кошелёк', en: 'Three OWork mobile screens: shifts, profile, and wallet' },
    size: 'widePhones',
    wide: true,
  },
  {
    src: '/media-grid/play-button.png?v=20260722-1',
    alt: { ru: 'Кнопка воспроизведения с персонажами и иконкой Telegram', en: 'Play button with characters and a Telegram icon' },
    size: 'wide620',
    wide: true,
  },
  {
    src: '/media-grid/finance-cards.png?v=20260722-1',
    alt: { ru: 'Карточки банковских продуктов с 3D-иллюстрациями', en: 'Banking product cards with 3D illustrations' },
    size: 'tall',
  },
  {
    src: '/media-grid/vacancy.png?v=20260722-1',
    alt: { ru: 'Карточка вакансии Senior Go Developer', en: 'Senior Go Developer vacancy card' },
    size: 'tall',
  },
  {
    src: '/media-grid/crypto-staking.png?v=20260722-1',
    alt: { ru: 'Интерфейс криптостейкинга и вознаграждений', en: 'Crypto staking and rewards interface' },
    size: 'wide620',
    wide: true,
  },
]

export function MediaGrid() {
  const { lang } = useLang()
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const viewerCardRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [originRect, setOriginRect] = useState<CardRect | null>(null)
  const [isClosing, setIsClosing] = useState(false)

  const openCard = useCallback(
    (index: number, event: MouseEvent<HTMLButtonElement>) => {
      if (activeIndex !== null || isClosing) return

      const { top, left, width, height } =
        event.currentTarget.getBoundingClientRect()
      setOriginRect({ top, left, width, height })
      setActiveIndex(index)
    },
    [activeIndex, isClosing],
  )

  const closeCard = useCallback(async () => {
    if (activeIndex === null || isClosing) return

    const viewerCard = viewerCardRef.current
    const sourceCard = cardRefs.current[activeIndex]
    if (!viewerCard || !sourceCard) {
      setActiveIndex(null)
      setOriginRect(null)
      return
    }

    setIsClosing(true)

    const restoreGrid = () => {
      setActiveIndex(null)
      setOriginRect(null)
      window.requestAnimationFrame(() => {
        sourceCard.focus({ preventScroll: true })
        window.requestAnimationFrame(() => setIsClosing(false))
      })
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      restoreGrid()
      return
    }

    const currentRect = viewerCard.getBoundingClientRect()
    const targetRect = sourceCard.getBoundingClientRect()
    const animation = viewerCard.animate(
      [
        { transform: 'translate(0, 0) scale(1, 1)' },
        {
          transform: `translate(${targetRect.left - currentRect.left}px, ${
            targetRect.top - currentRect.top
          }px) scale(${targetRect.width / currentRect.width}, ${
            targetRect.height / currentRect.height
          })`,
        },
      ],
      cardMotion,
    )

    try {
      await animation.finished
    } catch {
      // An interrupted animation can safely fall through to the reset below.
    }

    restoreGrid()
  }, [activeIndex, isClosing])

  useLayoutEffect(() => {
    if (activeIndex === null || !originRect || !viewerCardRef.current) return

    const viewerCard = viewerCardRef.current
    viewerCard.focus({ preventScroll: true })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targetRect = viewerCard.getBoundingClientRect()
    const animation = viewerCard.animate(
      [
        {
          transform: `translate(${originRect.left - targetRect.left}px, ${
            originRect.top - targetRect.top
          }px) scale(${originRect.width / targetRect.width}, ${
            originRect.height / targetRect.height
          })`,
        },
        { transform: 'translate(0, 0) scale(1, 1)' },
      ],
      cardMotion,
    )

    return () => animation.cancel()
  }, [activeIndex, originRect])

  useEffect(() => {
    if (activeIndex === null) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') void closeCard()
      if (event.key === 'Tab') {
        event.preventDefault()
        viewerCardRef.current?.focus({ preventScroll: true })
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, closeCard])

  const activeSlot = activeIndex === null ? null : slots[activeIndex]

  return (
    <>
      <section
        className={styles.grid}
        aria-label={lang === 'ru' ? 'Избранные работы' : 'Selected media'}
        aria-hidden={activeIndex !== null ? true : undefined}
        data-viewing={activeIndex !== null && !isClosing ? '' : undefined}
      >
        {slots.map((slot, index) => (
          <button
            ref={(node) => {
              cardRefs.current[index] = node
            }}
            type="button"
            key={slot.src}
            className={`${styles.slot} ${styles[slot.size]} ${slot.wide ? styles.wide : ''}`}
            style={{ '--reveal-index': index } as CSSProperties}
            aria-label={`${lang === 'ru' ? 'Увеличить превью' : 'Expand preview'}: ${t(slot.alt, lang)}`}
            aria-haspopup="dialog"
            onPointerOver={(event) => event.stopPropagation()}
            onClick={(event) => openCard(index, event)}
          >
            <img src={slot.src} alt={t(slot.alt, lang)} draggable={false} />
          </button>
        ))}
      </section>

      {activeSlot &&
        originRect &&
        createPortal(
          <div
            className={`${styles.viewer} ${isClosing ? styles.viewerClosing : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={t(activeSlot.alt, lang)}
            onClick={() => void closeCard()}
          >
            <div
              ref={viewerCardRef}
              className={styles.viewerCard}
              style={
                {
                  '--media-ratio': cardRatios[activeSlot.size],
                } as CSSProperties
              }
              tabIndex={-1}
              onClick={(event) => event.stopPropagation()}
            >
              <img src={activeSlot.src} alt={t(activeSlot.alt, lang)} draggable={false} />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
