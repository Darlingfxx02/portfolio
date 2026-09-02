import { useLang } from '@/lib/i18n'
import { CaseImageZoom } from './CaseImageZoom'
import styles from './CaseZinda.module.css'

const metrics = {
  ru: [
    { value: '8', label: 'интервью', note: '4 владельца бизнеса и 4 бухгалтера' },
    { value: '3 → 1', label: 'направление', note: 'три концепции свели в одну основу' },
    { value: '4', label: 'зоны банка', note: 'главная, платежи, профиль и чат' },
    { value: '4', suffix: 'месяца', label: 'до handoff', note: 'от нового направления до разработки' },
  ],
  en: [
    { value: '8', label: 'interviews', note: '4 business owners and 4 accountants' },
    { value: '3 → 1', label: 'direction', note: 'three concepts became one foundation' },
    { value: '4', label: 'bank areas', note: 'home, payments, profile, and chat' },
    { value: '4', suffix: 'months', label: 'to handoff', note: 'from new direction to engineering' },
  ],
}

export function CaseZinda() {
  const { lang } = useLang()
  const ru = lang === 'ru'
  const caseMetrics = metrics[lang]

  return (
    <CaseImageZoom className={styles.page}>
      <main className={styles.main}>
        <header className={styles.titleRow}>
          <h1>Zinda Bank</h1>
          <p>2023–2024</p>
        </header>

        <figure className={styles.hero}>
          <img
            src="/zinda/figma-case/hero.png"
            alt={ru ? 'B2B-банк Zinda на рабочем экране' : 'Zinda B2B bank on a desktop display'}
          />
        </figure>

        <section className={styles.intro}>
          <p className={styles.lead}>
            <span>
              {ru
                ? 'Zinda — новый B2B-банк для предпринимателей и бухгалтеров в Таджикистане.'
                : 'Zinda is a new B2B bank for entrepreneurs and accountants in Tajikistan.'}
            </span>{' '}
            <span className={styles.muted}>
              {ru
                ? 'Я присоединился после трёх отклонённых концепций и отвечал за продуктовую архитектуру, ключевые UX-сценарии, MVP, UI Kit и мобильное направление.'
                : 'I joined after three concepts had been rejected and owned product architecture, key UX journeys, MVP definition, the UI kit, and the mobile direction.'}
            </span>
          </p>
        </section>

        <section className={styles.uxBlock}>
          <p className={styles.kicker}>{ru ? 'Исследование и архитектура' : 'Research and architecture'}</p>
          <p className={styles.statement}>
            <span>
              {ru
                ? 'Интервью показали: людям важно видеть состояние бизнеса с первого экрана и быстро менять контекст компании.'
                : 'Interviews showed that people needed the state of the business at a glance and a fast way to change company context.'}
            </span>{' '}
            <span className={styles.muted}>
              {ru
                ? 'На этой основе я предложил multi-account архитектуру и связал четыре ключевые зоны в один банк.'
                : 'I used this to propose a multi-account architecture and connect four core areas into one bank.'}
            </span>
          </p>

          <dl className={styles.metrics}>
            {caseMetrics.map((metric) => (
              <div key={metric.label}>
                <dd>
                  {metric.value}
                  {metric.suffix && <span>{metric.suffix}</span>}
                </dd>
                <dt>{metric.label}</dt>
                <p>{metric.note}</p>
              </div>
            ))}
          </dl>
        </section>

        <SourceShowcase
          image="/zinda/figma-case/competitor-map.png"
          alt={ru ? 'Сравнение банковских продуктов и ключевых сценариев' : 'Comparison of banking products and core journeys'}
          title={ru ? 'Разобрали рынок по сценариям, а не по стилю.' : 'We compared the market by journeys, not visual style.'}
          note={
            ru
              ? 'Revolut, Wise, Альфа, Т-Банк и локальные продукты помогли выделить рабочие паттерны для главной, платежей, поиска и поддержки.'
              : 'Revolut, Wise, Alfa, T-Bank, and local products helped identify useful patterns for home, payments, search, and support.'
          }
        />

        <SourceShowcase
          image="/zinda/figma-case/flow-map.png"
          alt={ru ? 'Описание перевода между счетами и связанный user flow' : 'Account transfer specification and connected user flow'}
          title={ru ? 'Каждая функция получила цель, роли и полный flow.' : 'Every feature received a goal, roles, and a complete flow.'}
          note={
            ru
              ? 'В схеме фиксировали точки входа, права пользователей, ветвления, ошибки и связи с другими банковскими сценариями.'
              : 'The system captured entry points, user permissions, branches, errors, and connections to other banking journeys.'
          }
        />

        <Showcase
          image="/zinda/figma-case/mobile-primary.png"
          alt={ru ? 'Главная, платежи и обмен валют в Zinda' : 'Zinda home, payments, and currency exchange'}
          title={ru ? 'Один контекст для ежедневных операций.' : 'One context for daily operations.'}
          note={
            ru
              ? 'Главная показывает остатки и события; платежи и обмен продолжают сценарий без лишней вложенности.'
              : 'Home shows balances and events; payments and exchange continue the journey without unnecessary nesting.'
          }
        />

        <Showcase
          image="/zinda/figma-case/mobile-secondary.png"
          alt={ru ? 'Результат платежа, профиль компании и история операций' : 'Payment result, company profile, and transaction history'}
          title={ru ? 'Состояния объясняют, что происходит.' : 'States explain what is happening.'}
          note={
            ru
              ? 'Подтверждения, документы и история операций сохраняют контекст и подсказывают следующее действие.'
              : 'Confirmations, documents, and transaction history preserve context and make the next action clear.'
          }
        />

        <section className={styles.documentation}>
          <p className={styles.kicker}>{ru ? 'Живая документация' : 'Living documentation'}</p>
          <p className={styles.statement}>
            <span>
              {ru
                ? 'Чтобы десятки сценариев не распались между дизайном, юридическими требованиями и разработкой, я собрал единую систему описаний.'
                : 'To keep dozens of journeys aligned across design, legal requirements, and engineering, I built one documentation system.'}
            </span>{' '}
            <span className={styles.muted}>
              {ru
                ? 'Flow и экран связывались через роли, состояния, зависимости и граничные случаи.'
                : 'Flows and screens were connected through roles, states, dependencies, and edge cases.'}
            </span>
          </p>
          <div className={styles.documentationGrid}>
            <img
              src="/zinda/figma-case/specifications.jpg"
              alt={ru ? 'Спецификации банковских разделов' : 'Specifications for banking areas'}
            />
            <img
              src="/zinda/figma-case/screen-template.png"
              alt={ru ? 'Шаблон описания банковского экрана' : 'Banking screen documentation template'}
            />
            <img
              className={styles.statusModel}
              src="/zinda/figma-case/status-model.png"
              alt={ru ? 'Модель статусов переводов и связанных сценариев' : 'Transfer status model and connected journeys'}
            />
          </div>
          <Caption
            title={ru ? 'Документация стала частью продукта.' : 'Documentation became part of the product.'}
            note={
              ru
                ? 'Команда получила повторяемый формат для новых модулей, состояний и ошибок.'
                : 'The team gained a repeatable format for new modules, states, and errors.'
            }
          />
        </section>

        <section className={styles.systemBand}>
          <div className={styles.systemContent}>
            <div className={styles.systemGrid} aria-label={ru ? 'Компоненты дизайн-системы Zinda' : 'Zinda design-system components'}>
              <div className={styles.systemColumn}>
                <img src="/zinda/figma-case/ds-nav.png" alt="" />
                <img src="/zinda/figma-case/ds-status.png" alt="" />
              </div>
              <img className={styles.systemCurrency} src="/zinda/figma-case/ds-currencies.png" alt="" />
              <div className={styles.systemColumn}>
                <img src="/zinda/figma-case/ds-template.png" alt="" />
                <img src="/zinda/figma-case/ds-code.png" alt="" />
              </div>
            </div>
            <Caption
              title={ru ? 'Одна система для всего банка.' : 'One system for the whole bank.'}
              note={
                ru
                  ? 'Общий UI Kit связал веб, мобильное приложение, светлую и тёмную темы.'
                  : 'One UI kit connected web, mobile, light, and dark environments.'
              }
            />
          </div>
        </section>

        <section className={styles.chatBlock}>
          <img
            src="/zinda/figma-case/chat.png"
            alt={ru ? 'Чат поддержки Zinda в веб-банке' : 'Zinda support chat in the web bank'}
          />
          <Caption
            title={ru ? 'Чат стал частью банковского сценария.' : 'Chat became part of the banking journey.'}
            note={
              ru
                ? 'Обращения, статусы, вложения и быстрые действия используют тот же язык состояний, что и основной продукт.'
                : 'Requests, statuses, attachments, and quick actions use the same state language as the core product.'
            }
          />
        </section>

        <section className={styles.closing}>
          <p>
            <span>
              {ru
                ? 'За четыре месяца направление дошло до handoff, а банк позже вышел.'
                : 'The direction reached engineering handoff in four months, and the bank later launched.'}
            </span>{' '}
            <span className={styles.muted}>
              {ru
                ? 'Zinda стал моим переходом от отдельных интерфейсов к ответственности за архитектуру продукта и самостоятельному ведению мобильного направления.'
                : 'Zinda marked my move from individual interfaces to product architecture ownership and independently leading the mobile direction.'}
            </span>
          </p>
        </section>

        <footer className={styles.footer}>
          <a href="#work">{ru ? 'К кейсам' : 'All cases'}</a>
          <a href="#case/uxart">UXART</a>
        </footer>
      </main>
    </CaseImageZoom>
  )
}

function Showcase({
  image,
  alt,
  title,
  note,
}: {
  image: string
  alt: string
  title: string
  note: string
}) {
  return (
    <section className={styles.showcase}>
      <img src={image} alt={alt} />
      <Caption title={title} note={note} />
    </section>
  )
}

function SourceShowcase({
  image,
  alt,
  title,
  note,
}: {
  image: string
  alt: string
  title: string
  note: string
}) {
  return (
    <section className={styles.sourceShowcase}>
      <img src={image} alt={alt} />
      <Caption title={title} note={note} />
    </section>
  )
}

function Caption({ title, note }: { title: string; note: string }) {
  return (
    <p className={styles.caption}>
      <span>{title}</span>
      <span className={styles.muted}>{note}</span>
    </p>
  )
}
