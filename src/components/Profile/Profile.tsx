import { useState, type ReactNode } from 'react'
import { profile } from '@/data/profile'
import { PhotoFan, type FanPhoto } from '@/components/PhotoFan/PhotoFan'
import { UsageHeatmap } from '@/components/UsageHeatmap/UsageHeatmap'
import { useCompanyConfig } from '@/lib/personalization'
import { useLang, t } from '@/lib/i18n'
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
  { src: '/about/hobby2.webp', x: 152, y: 44, rotate: 8, w: 188 },
  { src: '/about/hobby1.webp', x: 80, y: 98, rotate: -2, w: 180 },
  { src: '/stickers/self-portrait.webp', x: 0, y: 64, rotate: -9, w: 188, alt: 'Portrait' },
]

export function Profile() {
  const { lang } = useLang()
  const ru = lang === 'ru'
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
            {t(profile.name, lang)}
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
        {ru ? (
          <p>
            Сейчас у меня <LocalTime />. Превращаю размытые бизнес-задачи в продукты,
            которыми пользуются. Ключевые направления — <Em id="domains">финтех и AI</Em>.
          </p>
        ) : (
          <p>
            Right now it’s <LocalTime /> my time. I turn fuzzy business problems into
            products people actually use. Core focus — <Em id="domains">fintech and AI</Em>.
          </p>
        )}
        {ru ? (
          <p>
            Открыт к founding / product ролям — пиши в{' '}
            <a className={styles.link} href={profile.telegram} target="_blank" rel="noreferrer">
              Telegram
            </a>{' '}
            или на <CopyEmail email={profile.email} />.
          </p>
        ) : (
          <p>
            Open to founding / product roles — reach me on{' '}
            <a className={styles.link} href={profile.telegram} target="_blank" rel="noreferrer">
              Telegram
            </a>{' '}
            or at <CopyEmail email={profile.email} />.
          </p>
        )}
        {ru ? (
          <p>
            Сильная сторона — <Em id="product-mind">продуктовое мышление</Em>: пайплайны,
            диалог с бизнесом и распутывание сложных ситуаций.
          </p>
        ) : (
          <p>
            My strength is <Em id="product-mind">product thinking</Em>: pipelines, a real
            dialogue with business, and untangling messy situations.
          </p>
        )}
        {ru ? (
          <p>
            За продуктовым мышлением стоит ежедневная практика: ритм работы с AI и
            автоматизация процессов растут с каждым годом. Создаю собственные решения — от{' '}
            <Em id="claude-skills">
              <a className={styles.link} href={profile.links.claudeSkills} target="_blank" rel="noreferrer">
                скиллов
              </a>
            </Em>{' '}
            и плагинов до полноценных сервисов.
          </p>
        ) : (
          <p>
            Behind that product thinking is daily practice: my rhythm with AI and process
            automation grow every year. I build my own tools — from{' '}
            <Em id="claude-skills">
              <a className={styles.link} href={profile.links.claudeSkills} target="_blank" rel="noreferrer">
                skills
              </a>
            </Em>{' '}
            and plugins to full-fledged services.
          </p>
        )}
        <UsageHeatmap />
        {ru ? (
          <p>
            <Em id="design-code">Использую AI для оптимизации всех возможных процессов</Em>{' '}
            без ущерба качества — от ресёрча и прототипов до наглядной аргументации решений.
          </p>
        ) : (
          <p>
            <Em id="design-code">I use AI to streamline every process I can</Em> without
            cutting quality — from research and prototypes to arguing decisions visually.
          </p>
        )}
        <p className={styles.explore}>
          {ru ? (
            <>
              Посмотреть{' '}
              <a className={styles.link} href="#works">
                избранные работы
              </a>
              .
            </>
          ) : (
            <>
              Take a look at my{' '}
              <a className={styles.link} href="#works">
                selected work
              </a>
              .
            </>
          )}
        </p>
      </div>
    </section>
  )
}
