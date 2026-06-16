import styles from './PhotoFan.module.css'

export type FanPhoto = {
  src: string
  alt?: string
  /** Target offset + tilt when fanned open (px / px / deg). */
  x: number
  y: number
  rotate: number
  /** Card width in px (height follows the 3:4 ratio). */
  w?: number
}

/**
 * Reusable photo-reveal: a stack of framed cards that fan out with a soft
 * spring + stagger when `open`, and collapse back when closed. Decoupled from
 * the trigger — drive `open` from a hover/focus/whatever upstream.
 */
export function PhotoFan({ photos, open }: { photos: FanPhoto[]; open: boolean }) {
  return (
    <div className={styles.fan} data-open={open || undefined} aria-hidden>
      {photos.map((p, i) => (
        <figure
          key={i}
          className={styles.card}
          style={{
            width: p.w ?? 184,
            zIndex: i + 1,
            opacity: open ? 1 : 0,
            transform: open
              ? `translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg)`
              : 'translate(0px, 20px) rotate(0deg) scale(0.84)',
            transitionDelay: open ? `${i * 40}ms` : '0ms',
          }}
        >
          <img src={p.src} alt={p.alt ?? ''} draggable={false} loading="lazy" />
        </figure>
      ))}
    </div>
  )
}
