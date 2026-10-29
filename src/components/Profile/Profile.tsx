import { profile } from '@/data/profile'
import { t, useLang } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import styles from './Profile.module.css'

export function Profile() {
  const { lang } = useLang()
  const { theme } = useTheme()

  return (
    <section className={styles.section}>
      <div
        className={styles.hero}
        aria-label={lang === 'ru' ? 'Видео-портрет' : 'Portrait video'}
      >
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          poster={theme === 'dark' ? '/hero-video-poster.png' : undefined}
          aria-label={t(profile.name, lang)}
        >
          <source src="/hero-video-silent.webm" type="video/webm" />
        </video>
        <div className={styles.videoGradients} aria-hidden />
      </div>

      <div className={styles.intro}>
        <div className={styles.identity}>
          <p className={styles.name}>{t(profile.name, lang)}</p>
          <p className={styles.age}>{t(profile.age, lang)}</p>
        </div>
        <div className={styles.description}>
          <p className={styles.introText}>
            {t(profile.bio.lead, lang)}
          </p>
          <p className={styles.tokenLine}>
            <span>{t(profile.bio.token, lang)}</span>
            <span className={styles.aiIcons} aria-label="Codex and Claude">
              <img className={styles.codexIcon}
                src={theme === 'light' ? '/stickers/codex-icon-dark.png' : '/stickers/codex-icon.webp'}
                alt="Codex" />
              <img src="/stickers/claude-icon.webp" alt="Claude" />
            </span>
            <span>{t(profile.bio.tail, lang)}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
