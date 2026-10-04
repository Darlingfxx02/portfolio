import { useLang } from '@/lib/i18n'
import { trackEvent, trackNoTypeClick } from '@/lib/analytics'
import styles from './NoTypePromo.module.css'

export function NoTypePromo() {
  const { lang } = useLang()

  return (
    <a
      className={styles.card}
      href="https://notype.tech/?utm_source=portfolio&utm_medium=referral&utm_campaign=cross_site&utm_content=notype_card"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        lang === 'ru'
          ? 'No Type — мой продукт. Открыть сайт'
          : 'No Type — my product. Visit the website'
      }
      onClick={(event) => {
        if (event.defaultPrevented) return
        trackEvent('product_opened', { target: 'notype' })
        trackNoTypeClick()
      }}
      onAuxClick={(event) => {
        if (event.button === 1 && !event.defaultPrevented) {
          trackEvent('product_opened', { target: 'notype' })
          trackNoTypeClick()
        }
      }}
    >
      <span className={styles.face} aria-hidden>
        <picture>
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet="/notype/pixel-face-still.png"
          />
          <img src="/notype/pixel-face.webp" alt="" width={57} height={40} />
        </picture>
      </span>
      <span className={styles.copy}>
        <span className={styles.heading}>
          <span className={styles.title}>No Type</span>
          <span className={styles.version}>V 0.0.1</span>
        </span>
        <span className={styles.description}>
          {lang === 'ru'
            ? 'Создал и выпустил приложение для голосового ввода.'
            : 'Designed, built, and released a voice typing app.'}
        </span>
      </span>
      <span className={styles.open} aria-hidden>
        <img src="/notype/arrow.svg" alt="" />
      </span>
    </a>
  )
}
