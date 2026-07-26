import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { click as playClick } from '@/lib/sound'
import styles from './CaseImageZoom.module.css'

type ImageRect = {
  top: number
  left: number
  width: number
  height: number
}

type ActiveImage = {
  src: string
  alt: string
  naturalWidth: number
  naturalHeight: number
  originRect: ImageRect
  source: HTMLImageElement
}

const imageMotion = {
  duration: 460,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  fill: 'both' as const,
}

function visibleImageRect(image: HTMLImageElement): ImageRect {
  const rect = image.getBoundingClientRect()
  const style = window.getComputedStyle(image)
  const insetLeft = Number.parseFloat(style.borderLeftWidth) +
    Number.parseFloat(style.paddingLeft)
  const insetRight = Number.parseFloat(style.borderRightWidth) +
    Number.parseFloat(style.paddingRight)
  const insetTop = Number.parseFloat(style.borderTopWidth) +
    Number.parseFloat(style.paddingTop)
  const insetBottom = Number.parseFloat(style.borderBottomWidth) +
    Number.parseFloat(style.paddingBottom)
  const contentWidth = Math.max(0, rect.width - insetLeft - insetRight)
  const contentHeight = Math.max(0, rect.height - insetTop - insetBottom)

  if (
    !image.naturalWidth ||
    !image.naturalHeight ||
    !['contain', 'scale-down'].includes(style.objectFit)
  ) {
    return {
      top: rect.top + insetTop,
      left: rect.left + insetLeft,
      width: contentWidth,
      height: contentHeight,
    }
  }

  const containScale = Math.min(
    contentWidth / image.naturalWidth,
    contentHeight / image.naturalHeight,
  )
  const scale =
    style.objectFit === 'scale-down' ? Math.min(containScale, 1) : containScale
  const width = image.naturalWidth * scale
  const height = image.naturalHeight * scale

  return {
    top: rect.top + insetTop + (contentHeight - height) / 2,
    left: rect.left + insetLeft + (contentWidth - width) / 2,
    width,
    height,
  }
}

export function CaseImageZoom({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const viewerCardRef = useRef<HTMLDivElement | null>(null)
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null)
  const [isClosing, setIsClosing] = useState(false)

  const openImage = useCallback(
    (image: HTMLImageElement) => {
      if (activeImage || isClosing || image.closest('[data-case-zoom="off"]')) return

      const { top, left, width, height } = visibleImageRect(image)
      const naturalWidth = image.naturalWidth || width
      const naturalHeight = image.naturalHeight || height
      if (!width || !height || !naturalWidth || !naturalHeight) return

      playClick()
      setActiveImage({
        src: image.currentSrc || image.src,
        alt: image.alt,
        naturalWidth,
        naturalHeight,
        originRect: { top, left, width, height },
        source: image,
      })
    },
    [activeImage, isClosing],
  )
  const openImageRef = useRef(openImage)

  useEffect(() => {
    openImageRef.current = openImage
  }, [openImage])

  const closeImage = useCallback(async () => {
    if (!activeImage || isClosing) return

    const viewerCard = viewerCardRef.current
    if (!viewerCard || !activeImage.source.isConnected) {
      setActiveImage(null)
      return
    }

    playClick()
    setIsClosing(true)

    const restoreViewer = () => {
      setActiveImage(null)
      window.requestAnimationFrame(() => {
        activeImage.source.focus({ preventScroll: true })
        window.requestAnimationFrame(() => setIsClosing(false))
      })
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      restoreViewer()
      return
    }

    const currentRect = viewerCard.getBoundingClientRect()
    const targetRect = visibleImageRect(activeImage.source)
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
      imageMotion,
    )

    try {
      await animation.finished
    } catch {
      // Interrupted close animations can safely reset the viewer.
    }

    restoreViewer()
  }, [activeImage, isClosing])

  useLayoutEffect(() => {
    if (!activeImage || !viewerCardRef.current) return

    const viewerCard = viewerCardRef.current
    viewerCard.focus({ preventScroll: true })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targetRect = viewerCard.getBoundingClientRect()
    const { originRect } = activeImage
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
      imageMotion,
    )

    return () => animation.cancel()
  }, [activeImage])

  useEffect(() => {
    if (!activeImage) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [activeImage])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const images = Array.from(
      root.querySelectorAll<HTMLImageElement>(
        '.case-narrative-hero img, .case-narrative-media img',
      ),
    ).filter((image) => !image.closest('[data-case-zoom="off"]'))
    const previousAttributes = images.map((image) => ({
      image,
      role: image.getAttribute('role'),
      tabIndex: image.getAttribute('tabindex'),
      label: image.getAttribute('aria-label'),
    }))

    images.forEach((image) => {
      image.setAttribute('role', 'button')
      image.tabIndex = 0
      image.setAttribute('aria-label', `Открыть изображение: ${image.alt}`)
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (!['Enter', ' '].includes(event.key)) return
      if (!(event.target instanceof HTMLImageElement) || !images.includes(event.target)) return
      event.preventDefault()
      event.stopPropagation()
      openImageRef.current(event.target)
    }
    root.addEventListener('keydown', onKeyDown)

    return () => {
      root.removeEventListener('keydown', onKeyDown)
      previousAttributes.forEach(({ image, role, tabIndex, label }) => {
        if (role === null) image.removeAttribute('role')
        else image.setAttribute('role', role)
        if (tabIndex === null) image.removeAttribute('tabindex')
        else image.setAttribute('tabindex', tabIndex)
        if (label === null) image.removeAttribute('aria-label')
        else image.setAttribute('aria-label', label)
      })
    }
  }, [children])

  const onRootClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLImageElement) openImage(event.target)
  }

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`} onClick={onRootClick}>
      {children}

      {activeImage &&
        createPortal(
          <div
            className={`${styles.viewer} ${isClosing ? styles.viewerClosing : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.alt || 'Просмотр изображения'}
            onClick={() => void closeImage()}
            onKeyDown={(event) => {
              event.stopPropagation()
              if (event.key === 'Escape') {
                event.preventDefault()
                void closeImage()
              }
              if (event.key === 'Tab') {
                event.preventDefault()
                viewerCardRef.current?.focus({ preventScroll: true })
              }
            }}
            onTouchMove={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            <div
              ref={viewerCardRef}
              className={styles.viewerCard}
              tabIndex={-1}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                width={activeImage.naturalWidth}
                height={activeImage.naturalHeight}
                draggable={false}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
