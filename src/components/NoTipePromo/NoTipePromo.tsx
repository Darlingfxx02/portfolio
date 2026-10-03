import { useLang } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import styles from './NoTipePromo.module.css'

export function NoTipePromo() {
  const { lang } = useLang()

  return (
    <a
      className={styles.card}
      href="https://notipe.tech/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        lang === 'ru'
          ? 'No Tipe — мой продукт. Открыть сайт'
          : 'No Tipe — my product. Visit the website'
      }
      onClick={() => trackEvent('product_opened', { target: 'notipe' })}
    >
      <span className={styles.face} aria-hidden>
        <picture>
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet="/notipe/pixel-face-still.png"
          />
          <img src="/notipe/pixel-face.webp" alt="" width={57} height={40} />
        </picture>
      </span>
      <span className={styles.copy}>
        <span className={styles.heading}>
          <span className={styles.title}>No Tipe</span>
          <span className={styles.version}>V 0.0.1</span>
        </span>
        <span className={styles.description}>
          {lang === 'ru'
            ? 'Создал и выпустил приложение для голосового ввода.'
            : 'Designed, built, and released a voice typing app.'}
        </span>
      </span>
      <span className={styles.open} aria-hidden>
        <img src="/notipe/arrow.svg" alt="" />
      </span>
    </a>
  )
}
