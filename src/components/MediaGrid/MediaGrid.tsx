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
import styles from './MediaGrid.module.css'

type MediaSlot = {
  src: string
  alt: string
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
    src: '/media-grid/file-sharing-upload.jpg?v=20260729-1',
    alt: 'Mobile file sharing upload interface',
    size: 'landscape',
  },
  {
    src: '/media-grid/crypto-wallet-swap.jpg?v=20260729-1',
    alt: 'Crypto wallet and asset swap mobile interfaces',
    size: 'landscape',
  },
  {
    src: '/media-grid/music-carousel.avif?v=20260731-1',
    alt: 'Perspective album carousel with music player controls',
    size: 'landscape',
  },
  {
    src: '/media-grid/birthday-message.avif?v=20260731-3',
    alt: 'Birthday message notification concept',
    size: 'landscape',
  },
  {
    src: '/media-grid/kyc-flow.avif?v=20260731-1',
    alt: 'Three-screen KYC identity verification flow',
    size: 'wideKyc',
    wide: true,
  },
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
    src: '/media-grid/chat-attachments.png?v=20260722-1',
    alt: 'AI chat with attached files and images',
    size: 'standard',
  },
  {
    src: '/media-grid/owork-three-phones.png?v=20260722-2',
    alt: 'Three OWork mobile screens: shifts, profile, and wallet',
    size: 'widePhones',
    wide: true,
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
        aria-label="Selected media"
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
            aria-label={`Expand preview: ${slot.alt}`}
            aria-haspopup="dialog"
            onPointerOver={(event) => event.stopPropagation()}
            onClick={(event) => openCard(index, event)}
          >
            <img src={slot.src} alt={slot.alt} draggable={false} />
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
            aria-label={activeSlot.alt}
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
              <img src={activeSlot.src} alt={activeSlot.alt} draggable={false} />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
