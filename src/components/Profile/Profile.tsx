import { useState, type ReactNode } from 'react'
import { profile } from '@/data/profile'
import { PhotoFan, type FanPhoto } from '@/components/PhotoFan/PhotoFan'
import { useCompanyConfig } from '@/lib/personalization'
import { LocalTime } from './LocalTime'
import { CopyEmail } from './CopyEmail'
import styles from './Profile.module.css'

/**
 * Emphasizable phrase in the bio. When the active company config lists this
 * id in `emphasis`, the phrase is surfaced (full color + medium weight).
 * The phrases (ids) are authored here; the AI only chooses which to emphasize.
 * Keep ids in sync with the text_blocks seed in server/src/seed.ts.
 */
function Em({ id, children }: { id: string; children: ReactNode }) {
  const { emphasis } = useCompanyConfig()
  const on = emphasis?.includes(id) ?? false
  return (
    <span className={on ? styles.em : undefined} data-em={on || undefined}>
      {children}
    </span>
  )
}

// Reveal photos shown when hovering/focusing the name.
const namePhotos: FanPhoto[] = [
  { src: '/about/hobby2.png', x: 152, y: 44, rotate: 8, w: 188 },
  { src: '/about/hobby1.png', x: 80, y: 98, rotate: -2, w: 180 },
  { src: '/stickers/self-portrait.png', x: 0, y: 64, rotate: -9, w: 188, alt: 'Портрет' },
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
          Сейчас у меня <LocalTime />. Превращаю размытые бизнес-задачи в продукты,
          которыми пользуются. Ключевые направления — <Em id="domains">финтех и AI</Em>.
        </p>
        <p>
          Открыт к founding / product ролям — пиши в{' '}
          <a className={styles.link} href={profile.telegram} target="_blank" rel="noreferrer">
            Telegram
          </a>{' '}
          или на <CopyEmail email={profile.email} />.
        </p>
        <p>
          Сильная сторона — <Em id="product-mind">продуктовое мышление</Em>: пайплайны,
          диалог с бизнесом и распутывание сложных ситуаций.
        </p>
        <p>
          <Em id="design-code">Код — мой множитель</Em>: проверяю гипотезы живыми
          прототипами, а не макетами, и держу руку на современных инструментах — под
          задачу бизнеса соберу нужный, вплоть до собственных{' '}
          <Em id="claude-skills">
            <a className={styles.link} href={profile.links.claudeSkills} target="_blank" rel="noreferrer">
              AI-скиллов
            </a>
          </Em>
          .
        </p>
        <p className={styles.explore}>
          Посмотреть{' '}
          <a className={styles.link} href="#works">
            избранные работы
          </a>
          .
        </p>
      </div>
    </section>
  )
}
