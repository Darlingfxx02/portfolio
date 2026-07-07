import { footerContent, socials } from '@/data/footer'
import { useLang, t } from '@/lib/i18n'
import styles from './Footer.module.css'

export function Footer() {
  const { lang } = useLang()
  return (
    <footer id="contact" className={styles.section}>
      <div className={styles.eyebrow}>
        <span className={styles.dot} />
        <span>{t(footerContent.eyebrow, lang)}</span>
      </div>

      <h2 className={styles.title}>{t(footerContent.title, lang)}</h2>

      <ul className={styles.socials}>
        {socials.map((s) => (
          <li key={s.label}>
            <a className={styles.social} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
