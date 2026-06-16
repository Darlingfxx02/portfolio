import { useState } from 'react'
import { profile } from '@/data/profile'
import { PhotoFan, type FanPhoto } from '@/components/PhotoFan/PhotoFan'
import { LocalTime } from './LocalTime'
import { CopyEmail } from './CopyEmail'
import styles from './Profile.module.css'

// Placeholder reveal photos — swap for real ones later.
const namePhotos: FanPhoto[] = [
  { src: '/about/who.png', x: 0, y: 64, rotate: -9, w: 188 },
  { src: '/about/hobby2.png', x: 152, y: 44, rotate: 8, w: 188 },
  { src: '/about/hobby1.png', x: 80, y: 98, rotate: -2, w: 180 },
]

export function Profile() {
  const [revealed, setRevealed] = useState(false)

  return (
    <section id="about" className={styles.section}>
      <PhotoFan open={revealed} photos={namePhotos} />

      <div className={styles.id}>
        <p className={styles.name}>
          <span
            className={styles.nameTrigger}
            data-sfx
            tabIndex={0}
            onMouseEnter={() => setRevealed(true)}
            onMouseLeave={() => setRevealed(false)}
            onFocus={() => setRevealed(true)}
            onBlur={() => setRevealed(false)}
          >
            {profile.name}
          </span>
        </p>
        <p className={styles.role}>
          {profile.role}{' '}
          <a
            className={styles.employer}
            href={profile.employerHref}
            target="_blank"
            rel="noreferrer"
          >
            {profile.employer}
          </a>
        </p>
      </div>

      <div className={styles.bio}>
        <p>
          Независимый продуктовый дизайнер, фокус — AI. Сейчас здесь <LocalTime />.
        </p>
        <p>
          Делаю инструменты, где дизайн и код сходятся, — от vibe-coded прототипов
          до{' '}
          <a className={styles.link} href={profile.links.claudeSkills} target="_blank" rel="noreferrer">
            скиллов для Claude
          </a>
          , которые собирают макеты прямо в Figma.
        </p>
        <p>
          Раньше вёл продукты в{' '}
          <a className={styles.link} href={profile.links.comboGpt} target="_blank" rel="noreferrer">
            ComboGPT
          </a>
          ,{' '}
          <a className={styles.link} href={profile.links.zinda} target="_blank" rel="noreferrer">
            Zinda
          </a>{' '}
          и{' '}
          <a className={styles.link} href={profile.links.uxart} target="_blank" rel="noreferrer">
            UXART
          </a>{' '}
          — AI-агрегаторы, финтех и дизайн-студия из топа Ruward.
        </p>
        <p>
          Открыт к founding / product design ролям в AI-стартапах. Пиши на{' '}
          <CopyEmail email={profile.email} /> или в{' '}
          <a className={styles.link} href={profile.telegram} target="_blank" rel="noreferrer">
            Telegram
          </a>
          .
        </p>
        <p className={styles.explore}>
          Explore my{' '}
          <a className={styles.link} href="#works">
            Selected work
          </a>
          .
        </p>
      </div>
    </section>
  )
}
