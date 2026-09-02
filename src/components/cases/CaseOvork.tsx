import { useLang } from '@/lib/i18n'
import { CaseImageZoom } from './CaseImageZoom'
import base from './CaseZinda.module.css'
import styles from './CaseOvork.module.css'

const metrics = {
  ru: [
    { value: '41% → 19%', label: 'денежные обращения', note: 'внутренний before/after-срез серии релизов' },
    { value: '71% → 89%', label: 'первый вывод', note: 'успешный первый вывод в том же срезе' },
    { value: '5–10', suffix: 'дней', label: 'релизный ритм', note: 'финансовый контур выпускали частями' },
    { value: '3', label: 'режима уведомлений', note: 'полный, сжатый и финансовый' },
  ],
  en: [
    { value: '41% → 19%', label: 'money-related contacts', note: 'internal before/after cut across a release series' },
    { value: '71% → 89%', label: 'first withdrawal', note: 'successful first withdrawal in the same cut' },
    { value: '5–10', suffix: 'days', label: 'release cadence', note: 'the financial layer shipped in slices' },
    { value: '3', label: 'notification modes', note: 'full, compact, and financial' },
  ],
}

export function CaseOvork() {
  const { lang } = useLang()
  const ru = lang === 'ru'
  const caseMetrics = metrics[lang]

  return (
    <CaseImageZoom className={`${base.page} ${styles.page}`}>
      <main className={base.main}>
        <header className={base.titleRow}>
          <h1>OVork</h1>
          <p>2024–2025</p>
        </header>

        <figure className={`${base.hero} ${styles.hero}`}>
          <DeviceRow
            images={['/ovork/dresser/core-01.webp', '/ovork/dresser/core-02.webp', '/ovork/dresser/core-03.webp']}
            alt={ru ? 'Поиск смены, кошелёк и финансовое событие OVork' : 'OVork shift search, wallet, and financial event'}
          />
        </figure>

        <section className={base.intro}>
          <p className={base.lead}>
            <span>
              {ru
                ? '— сервис временной занятости, который связывает поиск смены, выход на работу и получение денег.'
                : 'is a shift-work service connecting discovery, the job itself, and receiving payment.'}
            </span>
            <span className={base.muted}>
              {ru
                ? 'Я отвечал за продуктовую логику мобильного приложения: от допуска и выбора смены до кошелька, удержаний, чеков и уведомлений.'
                : 'I owned the mobile product logic from eligibility and shift selection to the wallet, deductions, receipts, and notifications.'}
            </span>
          </p>
        </section>

        <ProductBridge ru={ru} />

        <section className={`${base.uxBlock} ${styles.uxBlock}`}>
          <p className={base.kicker}>{ru ? 'Два кейса — один пользовательский путь' : 'Two cases, one user journey'}</p>
          <p className={base.statement}>
            <span>
              {ru
                ? 'Core отвечает на вопрос «смогу ли я выйти на смену?», Money — «когда и сколько я получу?». '
                : 'Core answers “Can I take this shift?”, while Money answers “When and how much will I receive?”'}
            </span>
            <span className={base.muted}>
              {ru
                ? 'Мы связали состояния между разделами, чтобы пользователь понимал текущее положение и следующий шаг без обращения в поддержку.'
                : 'We connected states across the product so users could understand their current position and next step without contacting support.'}
            </span>
          </p>

          <dl className={`${base.metrics} ${styles.metrics}`}>
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

        <PhoneShowcase
          images={['/ovork/dresser/work-01.webp', '/ovork/dresser/work-02.webp', '/ovork/dresser/work-03.webp']}
          alt={ru ? 'Выбор и состояния смены OVork' : 'OVork shift selection and states'}
          title={ru ? 'Выбор смены стал решением, а не чтением карточки.' : 'Choosing a shift became a decision, not a card-reading exercise.'}
          note={
            ru
              ? 'Оплата, время, длительность, требования и срочность собраны в один сканируемый контекст.'
              : 'Pay, time, duration, requirements, and urgency are combined into one scannable context.'
          }
        />

        <PhoneShowcase
          images={['/ovork/dresser/money-01.webp', '/ovork/dresser/money-02.webp', '/ovork/dresser/money-03.webp']}
          alt={ru ? 'Баланс, операции и детализация кошелька OVork' : 'OVork balance, operations, and wallet details'}
          title={ru ? 'Кошелёк объясняет происхождение суммы.' : 'The wallet explains where every amount came from.'}
          note={
            ru
              ? 'Начисление связано с конкретной сменой, а удержания и итог показаны до попытки вывода.'
              : 'Each accrual is tied to a shift, while deductions and the final amount appear before withdrawal.'
          }
        />

        <section className={`${base.documentation} ${styles.regulatory}`}>
          <p className={base.kicker}>{ru ? 'Регуляторный UX' : 'Regulatory UX'}</p>
          <p className={base.statement}>
            <span>
              {ru
                ? 'Требования ФНС сделали уведомления и задолженность частью главного экрана.'
                : 'Tax requirements made notifications and debt part of the home screen.'}
            </span>
            <span className={base.muted}>
              {ru
                ? 'Мы сохранили обязательную заметность, но не превратили её в блокирующий барьер для поиска смен и вывода денег.'
                : 'We kept the required visibility without turning it into a blocking barrier for finding shifts or withdrawing money.'}
            </span>
          </p>
        </section>

        <PhoneShowcase
          images={['/ovork/dresser/receipt-01.webp', '/ovork/dresser/receipt-02.webp', '/ovork/dresser/receipt-03.webp']}
          alt={ru ? 'Чеки, удержания и ограничения вывода OVork' : 'OVork receipts, deductions, and withdrawal restrictions'}
          title={ru ? 'Ограничения получили причину и следующий шаг.' : 'Restrictions received a reason and a next step.'}
          note={
            ru
              ? 'Налоговый долг, чек или удержание больше не выглядят как неизвестная ошибка системы.'
              : 'Tax debt, a receipt, or a deduction no longer looks like an unexplained system error.'
          }
        />

        <section className={`${base.systemBand} ${styles.notificationBand}`}>
          <div className={base.systemContent}>
            <div className={styles.notificationGrid}>
              {['/ovork/dresser/notify-01.webp', '/ovork/dresser/notify-02.webp', '/ovork/dresser/notify-03.webp'].map((src) => (
                <img key={src} src={src} alt="" />
              ))}
            </div>
            <Caption
              title={ru ? 'Одна система для финансовых событий.' : 'One system for financial events.'}
              note={
                ru
                  ? 'Поступление, списание, удержание и изменение статуса используют общий компонент и единый язык состояний.'
                  : 'Income, write-offs, deductions, and status changes share one component and one state language.'
              }
            />
          </div>
        </section>

        <section className={base.closing}>
          <p>
            <span>
              {ru
                ? 'После серии релизов OVork закрыл путь от поиска смены до получения оплаты.'
                : 'After a series of releases, OVork covered the journey from finding a shift to receiving payment.'}
            </span>
            <span className={base.muted}>
              {ru
                ? '41% → 19% и 71% → 89% — внутренние before/after-сигналы всего раздела, а не чистый A/B-тест одного интерфейсного решения.'
                : 'The 41% → 19% and 71% → 89% shifts are internal before/after signals for the whole area, not a clean A/B test of one interface decision.'}
            </span>
          </p>
        </section>

        <footer className={base.footer}>
          <a href="#work">{ru ? 'К кейсам' : 'All cases'}</a>
          <a href="#case/uxart">UXART</a>
        </footer>
      </main>
    </CaseImageZoom>
  )
}

function PhoneShowcase({
  images,
  alt,
  title,
  note,
}: {
  images: string[]
  alt: string
  title: string
  note: string
}) {
  return (
    <section className={base.showcase}>
      <DeviceRow images={images} alt={alt} />
      <Caption title={title} note={note} />
    </section>
  )
}

function ProductBridge({ ru }: { ru: boolean }) {
  return (
    <figure
      className={styles.productBridge}
      aria-label={ru ? 'Экраны выбора смены и кошелька OVork' : 'OVork shift selection and wallet screens'}
    >
      <img src="/ovork/dresser/work-01.webp" alt="" />
      <img src="/ovork/dresser/money-01.webp" alt="" />
    </figure>
  )
}

function DeviceRow({ images, alt }: { images: string[]; alt: string }) {
  return (
      <div className={styles.phoneStage} role="img" aria-label={alt}>
        {images.map((src) => (
          <img key={src} src={src} alt="" />
        ))}
      </div>
  )
}

function Caption({ title, note }: { title: string; note: string }) {
  return (
    <p className={base.caption}>
      <span>{title}</span>
      <span className={base.muted}>{note}</span>
    </p>
  )
}
