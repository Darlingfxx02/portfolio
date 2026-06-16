import { footerContent, socials } from '@/data/footer'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer id="contact" className={styles.section}>
      <div className={styles.eyebrow}>
        <span className={styles.dot} />
        <span>{footerContent.eyebrow}</span>
      </div>

      <h2 className={styles.title}>{footerContent.title}</h2>

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
