import { ProjectCard } from "@/components/case/ProjectCard";
import { Row } from "@/components/case/Row";
import { useLang } from "@/lib/i18n";

export function CaseZinda() {
  const { lang } = useLang();
  const ru = lang === "ru";
  return (
    <div className="zinda-page min-h-dvh w-full bg-[var(--c-page)] text-[color:var(--c-text)]">
      <div className="mx-auto w-full max-w-[1280px] px-5 pt-16 pb-24 md:px-6 md:pt-24 md:pb-32">
        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 1. Обзор                                                          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Обзор" : "Overview"}</Eyebrow>
                <p className="mt-4 text-[26px] md:text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[color:var(--c-text)]">
                  {ru
                    ? "Согласовали концепт с первой попытки после трёх отклонённых раундов до меня — за счёт многосчётной архитектуры под B2B-рынок Таджикистана."
                    : "Approved the concept on the first try after three rounds rejected before I joined — by building a multi-account architecture for Tajikistan's B2B market."}
                </p>
              </>
            }
          >
            <ul className="flex flex-wrap items-start gap-2">
              {(ru
                ? ["Финтех · B2B", "Web + Mobile", "2025"]
                : ["Fintech · B2B", "Web + Mobile", "2025"]
              ).map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-full bg-[var(--c-surface-2)] px-3.5 py-[7px] text-[13px] font-semibold leading-none text-[color:var(--c-text)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 2. Hero — phone mockup + laptop hero                              */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="flex w-full flex-col xl:flex-row items-center justify-center gap-6 xl:gap-4">
          {/* Phone mockup */}
          <div
            className="relative aspect-[326/600] h-full max-w-full shrink-0 overflow-hidden rounded-[20px] bg-[var(--c-invert-deep)]"
            style={{ height: 630 }}
          >
            <img
              src="/zinda/ellipse-1.webp"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -inset-[30%] h-[160%] w-[160%] object-cover"
            />
            <img
              src="/zinda/ellipse-2.webp"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -inset-[30%] h-[160%] w-[160%] rotate-90 object-cover"
            />
            <div className="absolute left-1/2 top-1/2 h-[409.6px] w-[203.4px] -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-x-[1.44px] inset-y-0 rounded-[29.667px] bg-[#1a1a1a] shadow-[inset_0_0_3.828px_rgba(255,255,255,0.9)] ring-[0.479px] ring-white/60" />
              <div className="absolute inset-x-[3.35px] inset-y-[1.91px] rounded-[27.753px] bg-black" />
              <div className="absolute left-0 top-[65px] h-[14.4px] w-[1.44px] rounded-l-[0.5px] bg-[#333]" />
              <div className="absolute left-0 top-[94.7px] h-[29.7px] w-[1.44px] rounded-l-[0.5px] bg-[#333]" />
              <div className="absolute left-0 top-[133px] h-[29.7px] w-[1.44px] rounded-l-[0.5px] bg-[#333]" />
              <div className="absolute right-0 top-[105.3px] h-[47.9px] w-[1.44px] rounded-r-[0.5px] bg-[#333]" />
              <div className="absolute inset-x-[11.96px] inset-y-[10.53px] overflow-hidden rounded-[19.14px] bg-white">
                <img
                  src="/zinda/phone-screen.webp"
                  alt={ru ? "Мобильный экран Zinda" : "Zinda mobile screen"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Laptop hero */}
          <div
            className="relative aspect-[800/600] w-full max-w-[840px] xl:w-auto xl:h-[630px] overflow-hidden rounded-[20px]"
          >
            <img
              src="/zinda/hero-laptop.webp"
              alt={ru ? "Zinda на лэптопе" : "Zinda on a laptop"}
              className="absolute inset-0 h-full w-full rounded-[20px] object-cover"
            />
            <img
              src="/zinda/hero-overlay.webp"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full rounded-[20px] object-cover"
            />
          </div>
        </section>

        <div className="h-12 md:h-20" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* Карточка проекта                                                  */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <ProjectCard
            meta={[
              {
                label: ru ? "Роль" : "Role",
                value: ru
                  ? "Концепт-дизайнер · команда из трёх · 4 месяца"
                  : "Concept designer · team of three · 4 months",
              },
              {
                label: ru ? "Контекст" : "Context",
                value: ru
                  ? "Zinda TGS — первый цифровой банк Таджикистана с удалённым открытием карты. Фокус — B2B: владельцы, директора, бухгалтеры."
                  : "Zinda TGS — Tajikistan's first digital bank with fully remote card issuance. Focused on B2B: owners, directors, accountants.",
              },
            ]}
            problem={
              ru
                ? "Три отклонённых концептных раунда до меня. Параллельно — рынок, где один бухгалтер ведёт несколько компаний с несколькими счетами."
                : "Three concept rounds rejected before I joined. On top of that, a market where one accountant runs several companies across multiple accounts."
            }
            solution={
              ru
                ? "Многосчётный паттерн: плашки счетов на главном + сайдбар-свитчер компаний. Кредитку отложил в постMVP через карту зависимостей."
                : "A multi-account pattern: account tiles on the home screen plus a company switcher in the sidebar. Deferred the credit card to post-MVP via a dependency map."
            }
            result={
              ru
                ? "Согласовали с первой попытки. Сдали макеты за 4 месяца. Банк релизнули. Архитектуру отстояли, визуальный тон — нет."
                : "Approved on the first try. Delivered the designs in 4 months. The bank shipped. Held the line on the architecture, lost the visual tone."
            }
          />
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 3. Первый цифровой банк Таджикистана                              */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
                {ru
                  ? "Первый цифровой банк Таджикистана с удалённым открытием карты."
                  : "Tajikistan's first digital bank with remote card issuance."}
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Zinda TGS — первый банк в стране, где карту можно открыть полностью удалённо, без визита в отделение. Фокус продукта — B2B-сегмент: владельцы бизнеса, директора с правом подписи и бухгалтеры. У каждой роли свои сценарии, права и мотивации. Архитектура многосчётности под рынок, где один бухгалтер ведёт несколько компаний параллельно."
                : "Zinda TGS is the first bank in the country where you can open a card fully remotely, with no branch visit. The product targets the B2B segment: business owners, directors with signing authority, and accountants. Each role has its own scenarios, permissions, and motivations. A multi-account architecture built for a market where one accountant runs several companies at once."}
            </p>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 4. Стартовая обстановка                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
              {ru ? "Стартовая обстановка" : "Starting conditions"}
            </h2>
          </Narrow>
          <div className="mt-12 flex w-full flex-col md:flex-row items-stretch gap-4 md:gap-5">
            <ConstraintCard
              label="NDA"
              body={
                ru
                  ? "Детали финансов и скоупа закрыты."
                  : "Financial and scope details are under wraps."
              }
            />
            <ConstraintCard
              label={ru ? "Многослойная заказная структура" : "A layered client structure"}
              body={
                ru
                  ? "Работа через прокси-заказчика с собственными эстетическими предпочтениями. Конечный заказчик-банк сам не имел чёткого видения по фичам."
                  : "Working through a proxy client with its own aesthetic preferences. The end client — the bank — had no clear vision on features itself."
              }
            />
            <ConstraintCard
              label={ru ? "Психологический фон трёх отказов" : "The weight of three prior rejections"}
              body={
                ru
                  ? "Четвёртый отказ грозил остановкой проекта."
                  : "A fourth rejection could have shut the project down."
              }
            />
            <ConstraintCard
              label={ru ? "Срок" : "Timeline"}
              body={
                ru
                  ? "4 месяца от моего захода до сдачи макетов в разработку."
                  : "4 months from when I joined to handing designs off to development."
              }
            />
          </div>
        </section>

        <div className="h-12 md:h-20" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 5. Три MacBook-мокапа                                             */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="flex w-full flex-col md:flex-row items-start gap-6 md:gap-8 rounded-[24px] bg-[var(--c-surface)] px-4 py-6 md:px-6 md:py-10">
          {["macbook-1.webp", "macbook-2.webp", "macbook-3.webp"].map((src) => (
            <div
              key={src}
              className="relative w-full md:flex-1 aspect-[3846/2344] min-w-0"
            >
              <img
                src={`/zinda/${src}`}
                alt={ru ? "Mockup интерфейса Zinda" : "Zinda interface mockup"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 6. Что мешало двинуть проект                                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
                {ru ? "Что мешало двинуть проект" : "What was blocking the project"}
              </h2>
            }
          >
            <div className="space-y-6 text-[18px] leading-[1.6]">
              <p className="text-[color:var(--c-text)]">
                {ru
                  ? "Когда я подключился, у команды уже было три отклонённых концептных раунда. Заказчик не согласовал ни один и не мог чётко сформулировать почему. На входе у проекта был чек-лист фичей в Excel и общее направление «нужен банк уровня Тиньков»."
                  : "By the time I joined, the team already had three rejected concept rounds. The client had approved none of them and couldn't clearly explain why. All the project came in with was a feature checklist in Excel and a vague direction: \"we need a bank on the level of Tinkoff.\""}
              </p>
              <p className="text-[color:var(--c-text)]">
                {ru
                  ? "Параллельно был вызов рынка: B2B-юзеры в Таджикистане работают в нестандартном для необанков паттерне. Один бухгалтер ведёт несколько компаний параллельно, у каждой — несколько расчётных счетов под разные задачи (налоги, операционка, расчёты). Стандартная западная схема «один основной счёт + остальные в подменю» сюда не переносилась."
                  : "There was also a market challenge: B2B users in Tajikistan work in a pattern that's unusual for neobanks. One accountant runs several companies at once, each with multiple current accounts for different purposes (taxes, operations, settlements). The standard Western model — \"one primary account plus the rest in a submenu\" — didn't map onto this."}
              </p>
              <p className="text-[color:var(--c-text-2)]">
                {ru
                  ? "Проблема была двойной: внутри проекта — застрявшая концептная фаза, на стороне продукта — рынок, требующий перепроектирования стандартных банковских паттернов."
                  : "The problem was twofold: inside the project, a stalled concept phase; on the product side, a market that demanded rethinking standard banking patterns."}
              </p>
            </div>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 7. Что выцепил из проекта                                         */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
                {ru ? "Что выцепил из проекта" : "What I pulled out of the project"}
              </h2>
            }
          >
            <div className="space-y-6 text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              <p>
                {ru
                  ? "Чтобы понять, во что упёрлись предыдущие итерации, провели с командой 8 глубинных интервью — 4 владельца бизнеса и 4 бухгалтера, все работавшие с банками в Таджикистане. Вопросник готовил я."
                  : "To understand where the earlier iterations had hit a wall, we ran 8 in-depth interviews as a team — 4 business owners and 4 accountants, all of them people who'd worked with banks in Tajikistan. I wrote the question guide."}
              </p>
              <p>
                {ru
                  ? "Главный инсайт: B2B-юзер здесь живёт в многосчётной экосистеме. Один бухгалтер ведёт несколько компаний, у каждой — расчётные счета под разные задачи. Это не B2C-привычка, это профессиональная норма рынка."
                  : "The key insight: the B2B user here lives in a multi-account ecosystem. One accountant runs several companies, each with current accounts for different purposes. This isn't a B2C habit — it's the professional norm of the market."}
              </p>
              <p>
                {ru
                  ? "Параллельно построили чистый юзер-флоу всего сервиса. Через него стали видны лишние действия и абстрактные сценарии («делай хорошо, не делай плохо»), которые тащились с предыдущих итераций команды — и были одной из причин отказов заказчика. Юзер-флоу здесь работал как диагностический инструмент против легаси, не как декоративный артефакт."
                  : "In parallel we built a clean user flow for the whole service. It surfaced the redundant steps and hand-wavy scenarios (\"do the good thing, don't do the bad thing\") that had been carried over from the team's earlier iterations — and were one of the reasons the client kept rejecting the work. Here the user flow worked as a diagnostic tool against legacy, not as a decorative artifact."}
              </p>
            </div>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 8. Главная JTBD                                                   */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row heading={<Eyebrow>{ru ? "Главная JTBD" : "Core JTBD"}</Eyebrow>}>
            <p className="text-[20px] md:text-[24px] font-semibold leading-[1.3] tracking-[-0.005em] text-[color:var(--c-text)]">
              {ru
                ? "«Как бухгалтер, я хочу быстро переключаться между счетами разных бизнесов, чтобы решать задачи в режиме единого потока»."
                : "\"As an accountant, I want to switch quickly between the accounts of different businesses, so I can get things done in a single, uninterrupted flow.\""}
            </p>
            <p className="mt-6 text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Эта формулировка стала фундаментом архитектурных решений."
                : "This framing became the foundation for every architectural decision."}
            </p>
          </Row>
        </section>

        <div className="h-12 md:h-20" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 9. Tile · Цепочка research → design                               */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <div className="flex w-full flex-col md:flex-row items-start gap-4">
            <div className="relative aspect-[1200/1396] w-full md:flex-1 overflow-hidden rounded-[24px] bg-black">
              <img
                src="/zinda/research-1.webp"
                alt={ru ? "Карта research → design — фрагмент 1" : "Research → design map — part 1"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="relative aspect-[1200/1396] w-full md:flex-1 overflow-hidden rounded-[24px] bg-black">
              <img
                src="/zinda/research-2.webp"
                alt={ru ? "Карта research → design — фрагмент 2" : "Research → design map — part 2"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
          <Row className="mt-10" heading={<Eyebrow>{ru ? "Цепочка research → design" : "The research → design chain"}</Eyebrow>}>
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "8 интервью → инсайт о многосчётности → JTBD «единый поток между счетами» → архитектурные решения. Юзер-флоу как диагностический инструмент против легаси предыдущих итераций."
                : "8 interviews → the multi-account insight → the JTBD of \"a single flow across accounts\" → architectural decisions. The user flow as a diagnostic tool against the legacy of earlier iterations."}
            </p>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 10. Мой концепт                                                   */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
              {ru ? "Мой концепт" : "My concept"}
            </h2>
          </Narrow>
          <div className="mt-10 flex flex-col xl:flex-row xl:h-[580px] w-full items-stretch gap-4">
            {/* Left: concept laptop on stage */}
            <div className="w-full xl:w-auto aspect-[773/520] flex h-auto xl:h-full min-w-0 items-end justify-center overflow-clip rounded-[24px] bg-[var(--c-surface)] px-4 pt-6 md:px-12 md:pt-12">
              <div className="relative h-full min-w-0 flex-1 rounded-t-[12px] bg-black shadow-[0_0_0_8px_black,0_0_0_9px_#a1a1a1]">
                <img
                  src="/zinda/concept-bento-laptop.webp"
                  alt={ru ? "Концепт-макет десктопного интерфейса Zinda" : "Concept mockup of the Zinda desktop interface"}
                  className="absolute inset-0 h-full w-full rounded-t-[12px] object-cover"
                />
              </div>
            </div>
            {/* Right column: 2 stacked panels */}
            <div className="flex w-full xl:w-auto h-auto xl:h-full min-w-0 xl:flex-1 flex-col gap-4">
              <div className="flex xl:min-h-0 xl:flex-1 items-center justify-center overflow-clip rounded-[24px] bg-[var(--c-surface)] px-5 py-6 xl:py-0">
                <img
                  src="/zinda/concept-bento-channels.webp"
                  alt={ru ? "Сетка карточек платёжных каналов" : "Grid of payment-channel cards"}
                  className="block max-h-full w-full object-contain"
                />
              </div>
              <div className="flex xl:min-h-0 xl:flex-1 items-center justify-center overflow-clip rounded-[24px] bg-[var(--c-surface)] px-5 py-6 xl:py-4">
                <img
                  src="/zinda/concept-bento-exchange.webp"
                  alt={ru ? "Виджет обмена валюты" : "Currency-exchange widget"}
                  className="block max-h-full w-auto object-contain"
                />
              </div>
            </div>
          </div>
          <Narrow className="mt-10">
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Такой концепт родился за четыре дня после начала моей работы над проектом. Мы полностью защитили его перед заказчиком и перешли к его внутреннему оформлению, к отрисовке лоу-фиделити-прототипов и подготовке прочих макетов."
                : "This concept came together within four days of my joining the project. We defended it in full to the client and moved on to fleshing it out — drawing low-fidelity prototypes and preparing the rest of the designs."}
            </p>
          </Narrow>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 11. Развилка · MVP-скоуп                                          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Развилка" : "Fork"}</Eyebrow>
                <h2 className="mt-4 text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
                  {ru ? "MVP-скоуп" : "MVP scope"}
                </h2>
              </>
            }
          >
            <p className="text-[20px] font-medium leading-[1.4] tracking-[-0.005em] text-[color:var(--c-text)]">
              {ru
                ? "Что делать с кредитными продуктами, если заказчик не может сформулировать сценарии, а они цепляются за главную, счета и операции?"
                : "What do you do with credit products when the client can't articulate the scenarios, yet those products are wired into the home screen, the accounts, and the transactions?"}
            </p>
          </Row>
          <div className="mt-12 flex w-full flex-col md:flex-row items-stretch gap-4 md:gap-5">
            <ForkOption
              letter="A"
              title={ru ? "Продолжать на текущих допущениях" : "Keep going on current assumptions"}
              note={
                ru
                  ? "Дизайнить кредитку наугад. Риск: переделывать смежные флоу, когда требования прояснятся."
                  : "Design the credit card by guesswork. The risk: reworking adjacent flows once the requirements become clear."
              }
            />
            <ForkOption
              letter="B"
              title={ru ? "Отложить целиком и зафиксировать прозрачно" : "Defer it entirely and log it transparently"}
              note={
                ru
                  ? "Кредитка → постMVP. Через карту зависимостей показать, что блокирует смежные флоу. Освобождает фокус на главное."
                  : "Credit card → post-MVP. Use a dependency map to show what's blocking the adjacent flows. Frees up focus for what matters."
              }
              chosen
            />
            <ForkOption
              letter="C"
              title={ru ? "Угадать урезанную версию" : "Guess at a stripped-down version"}
              note={
                ru
                  ? "Зафиксировать минимальный кредитный продукт от себя. Снимает блокировку, но создаёт фейковую определённость и прячет неоднозначность от заказчика."
                  : "Lock in a minimal credit product on my own call. It unblocks the work, but manufactures false certainty and hides the ambiguity from the client."
              }
            />
          </div>
          <div className="mt-10 rounded-[20px] bg-[var(--c-surface)] px-6 py-8 md:px-8 md:py-10">
            <div className="flex w-full flex-col md:flex-row items-start gap-8 md:gap-12">
              <p className="flex-1 text-[18px] font-medium leading-[1.6] text-[color:var(--c-text)]">
                {ru
                  ? "Предложил на созвоне третий путь — через карту зависимостей, не через «нам сложно с кредиткой». Заказчик согласился: кредитка ушла в постMVP, фокус — сценарии работы со счетами."
                  : "On a call I proposed a third path — through a dependency map, not through \"the credit card is hard for us.\" The client agreed: the credit card moved to post-MVP, and the focus stayed on account workflows."}
              </p>
              <p className="flex-1 text-[16px] leading-[1.55] text-[color:var(--c-text-2)]">
                {ru
                  ? "Цена: пришлось публично признать, что часть скоупа нельзя сделать без дополнительных входных данных — уязвимая позиция перед прокси-заказчиком."
                  : "The cost: I had to admit publicly that part of the scope couldn't be built without more input — an exposed position to take in front of a proxy client."}
              </p>
            </div>
          </div>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 12. Развилка · Архитектура                                        */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Развилка" : "Fork"}</Eyebrow>
                <h2 className="mt-4 text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
                  {ru ? "Архитектура" : "Architecture"}
                </h2>
              </>
            }
          >
            <p className="text-[20px] font-medium leading-[1.4] tracking-[-0.005em] text-[color:var(--c-text)]">
              {ru
                ? "Где счета живут на главном экране и как переключаешься между бизнесами?"
                : "Where do the accounts live on the home screen, and how do you switch between businesses?"}
            </p>
          </Row>
          <div className="mt-12 flex w-full flex-col md:flex-row items-stretch gap-4 md:gap-5">
            <ForkOption
              letter="A"
              title={ru ? "Западная иерархия" : "The Western hierarchy"}
              note={
                ru
                  ? "Один основной счёт + остальные в подменю. Знакомый паттерн необанков, но добавляет клик на каждое переключение в многосчётном сценарии."
                  : "One primary account plus the rest in a submenu. A familiar neobank pattern, but it adds a click to every switch in a multi-account scenario."
              }
            />
            <ForkOption
              letter="B"
              title={ru ? "Равноправные плашки + сайдбар-свитчер компаний" : "Equal-weight tiles + a company switcher in the sidebar"}
              note={
                ru
                  ? "Все счета видны одновременно на главном экране, переключение между юрлицами — одним движением из левого сайдбара."
                  : "All accounts visible at once on the home screen; switching between legal entities happens in one move from the left sidebar."
              }
              chosen
            />
            <ForkOption
              letter="C"
              title={ru ? "Контекстный показ" : "Context-aware display"}
              note={
                ru
                  ? "Показывать только релевантные счета под текущую задачу. Перегружает интерфейс логикой угадывания и ломает предсказуемость."
                  : "Show only the accounts relevant to the current task. It overloads the interface with guessing logic and breaks predictability."
              }
            />
          </div>
          <div className="mt-10 rounded-[20px] bg-[var(--c-surface)] px-6 py-8 md:px-8 md:py-10">
            <div className="flex w-full flex-col md:flex-row items-start gap-8 md:gap-12">
              <p className="flex-1 text-[18px] font-medium leading-[1.6] text-[color:var(--c-text)]">
                {ru
                  ? "Выбрал B. JTBD требует единого потока работы — иерархия добавляет лишний клик, контекстный показ заставляет угадывать. Плашки на главной + сайдбар = бухгалтер видит весь свой контекст и переключается одним движением."
                  : "I chose B. The JTBD calls for a single, uninterrupted flow — a hierarchy adds an extra click, context-aware display forces guessing. Tiles on the home screen plus the sidebar mean the accountant sees their whole context and switches in one move."}
              </p>
              <p className="flex-1 text-[16px] leading-[1.55] text-[color:var(--c-text-2)]">
                {ru
                  ? "Цена: вышли за пределы привычной B2C-логики необанков. Пришлось защищать архитектуру через данные интервью, а не через «как у Тинькова»."
                  : "The cost: we stepped outside the familiar B2C logic of neobanks. I had to defend the architecture with interview data, not with \"the way Tinkoff does it.\""}
              </p>
            </div>
          </div>
        </section>

        <div className="h-12 md:h-20" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 13. Tile · Три варианта архитектуры                               */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <div
            className="relative flex h-[580px] w-full items-stretch justify-center overflow-hidden rounded-[24px] px-6 md:px-[95px]"
            style={{
              background:
                "linear-gradient(270deg, rgba(147, 116, 216, 0) 0%, rgb(64, 55, 104) 100%), rgb(148, 116, 218)",
            }}
          >
            <img
              src="/zinda/three-variants.webp"
              alt={ru ? "Три варианта архитектуры — выбран средний" : "Three architecture variants — the middle one was chosen"}
              className="block h-full w-auto object-contain"
            />
            <span className="absolute right-[286px] top-[25.8px] text-[16px] font-semibold leading-[24px] text-white">
              {ru ? "Мое решение" : "My solution"}
            </span>
            <span className="absolute bottom-[17.2px] left-[166px] text-[16px] font-semibold leading-[24px] text-white">
              {ru ? "Версия студии" : "The studio's version"}
            </span>
            <span className="absolute bottom-[17.2px] left-[calc(50%-136px)] text-[16px] font-semibold leading-[24px] text-white">
              {ru ? "Временно консенсусное решение" : "The interim consensus"}
            </span>
          </div>
          <Row className="mt-10" heading={<Eyebrow>{ru ? "Три варианта в ряд · выбран средний" : "Three variants side by side · the middle one won"}</Eyebrow>}>
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Студия хотела вверху экрана расположить логотип бренда. Я хотел расположить там кнопку управления компаниями, чтобы не объединять настройки и компанию. Но в итоге такое решение не удалось продавить и мы сохранили нечто среднее, что визуально не разбивается на два блока, неинтуитивных."
                : "The studio wanted the brand logo at the top of the screen. I wanted the company-management control there instead, so that settings and companies wouldn't be lumped together. In the end I couldn't push that through, and we kept something in between — one that doesn't visually split into two unintuitive blocks."}
            </p>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 14. Развилка · Визуальный тон                                     */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Развилка" : "Fork"}</Eyebrow>
                <h2 className="mt-4 text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
                  {ru ? "Визуальный тон" : "Visual tone"}
                </h2>
              </>
            }
          >
            <p className="text-[20px] font-medium leading-[1.4] tracking-[-0.005em] text-[color:var(--c-text)]">
              {ru
                ? "Конфликт с прокси-заказчиком-студией: ей нужен выразительный кейс в портфолио, нам — спокойный B2B-инструмент. Бой развалился на две части с разным исходом."
                : "A conflict with the proxy client — the studio: they wanted a striking portfolio case, we wanted a calm B2B tool. The fight split into two parts with different outcomes."}
            </p>
          </Row>
          <div className="mt-12 flex flex-col md:flex-row h-auto md:h-[480px] w-full gap-4 md:gap-5">
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-[16px] bg-[var(--c-surface)] px-4 md:px-10">
              <img
                src="/zinda/tone-1.webp"
                alt={ru ? "Скриншот — версия с акцентным тоном" : "Screenshot — the bolder-tone version"}
                className="w-full rounded-[8px] object-cover"
              />
            </div>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-[16px] bg-[var(--c-surface)] px-4 md:px-10">
              <img
                src="/zinda/tone-2.webp"
                alt={ru ? "Скриншот — версия со спокойным тоном" : "Screenshot — the calmer-tone version"}
                className="w-full rounded-[8px] object-cover"
              />
            </div>
          </div>
          <div className="mt-5 flex w-full flex-col md:flex-row items-stretch gap-4 md:gap-5">
            <ToneCard
              title={ru ? "Отказ от повсеместного Liquid Glass" : "Dropping Liquid Glass everywhere"}
              tag={ru ? "ОТСТОЯЛИ" : "WON"}
              body={
                ru
                  ? "Для студии это был тактический пункт. Аргументация через Apple HIG и конкретные проблемы реализации перевесила — отбили целиком."
                  : "For the studio this was a tactical point. Arguing from the Apple HIG and concrete implementation problems tipped it — we won it outright."
              }
            />
            <ToneCard
              title={ru ? "Общий тон" : "The overall tone"}
              tag={ru ? "ПРОИГРАЛИ" : "LOST"}
              body={
                ru
                  ? "Для студии это была их core-цель. Спорили не о фактах, а о целях. UX-аргументы про «бухгалтер по 4–6 часов в день» не пробили — у студии другая оптика. В прод вышло заметно ярче, чем оптимально для B2B."
                  : "For the studio this was their core goal. We were arguing about goals, not facts. UX arguments like \"the accountant is in this 4–6 hours a day\" didn't land — the studio sees it through a different lens. Production shipped noticeably louder than is optimal for B2B."
              }
            />
          </div>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 15. Что менялось за 4 месяца                                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
                {ru ? "Что менялось за 4 месяца" : "What shifted over 4 months"}
              </h2>
            }
          >
            <div className="space-y-6 text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              <p>
                {ru
                  ? "После согласования концепта работа разбилась на циклы: отрисовка → ревью с прокси-заказчиком → правки. Переломных точек было три."
                  : "Once the concept was approved, the work broke into cycles: design → review with the proxy client → revisions. There were three turning points."}
              </p>
              <p>
                {ru
                  ? "Первая — момент с MVP-скоупом: предложение отложить кредитные продукты через карту зависимостей. Дальше дизайн поехал без подвешенных мест."
                  : "The first was the MVP-scope moment: proposing to defer credit products via the dependency map. After that, the design moved forward with no loose ends."}
              </p>
              <p>
                {ru
                  ? "Вторая — циклы по визуальному тону. Постепенно стало понятно, что эстетический спор не выиграть полностью. Сделал ставку на сохранение архитектуры и тех решений, где аргумент через гайдлайны работал."
                  : "The second was the cycles over visual tone. It gradually became clear the aesthetic argument couldn't be won outright. I bet on preserving the architecture and the decisions where an argument from guidelines actually worked."}
              </p>
              <p>
                {ru
                  ? "Третья — финальная сверка с дизайн-системой и стейтами. Параллельно с дизайнером дизайн-системы доводили компоненты до production-готовности, со вторым дизайнером — крутили краевые состояния и ошибки."
                  : "The third was the final pass against the design system and states. With the design-system designer we brought components to production readiness; with the second designer we worked through edge states and errors."}
              </p>
            </div>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 16. Tile · Главный экран · многосчётная выкладка                  */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <div className="flex flex-col md:flex-row h-auto md:h-[620px] w-full items-center justify-center gap-8 md:gap-12 overflow-hidden rounded-[24px] bg-[var(--c-surface)] pt-[30px]">
            <div className="flex h-full w-full md:w-[851px] flex-col items-center justify-end">
              <div className="relative aspect-[2880/1800] w-full rounded-t-[12px] bg-black shadow-[0_0_0_8px_black,0_0_0_9px_#a1a1a1]">
                <img
                  src="/zinda/main-screen.webp"
                  alt={ru ? "Главный экран Zinda — десктоп" : "Zinda home screen — desktop"}
                  className="absolute inset-0 h-full w-full rounded-t-[12px] object-cover"
                />
              </div>
            </div>
            <div className="relative h-[409.6px] w-[203.4px] shrink-0">
              <div className="absolute inset-x-[1.44px] inset-y-0 rounded-[29.667px] bg-[#1a1a1a] shadow-[inset_0_0_3.828px_rgba(255,255,255,0.9)] ring-[0.479px] ring-white/60" />
              <div className="absolute inset-x-[3.35px] inset-y-[1.91px] rounded-[27.753px] bg-black" />
              <div className="absolute left-0 top-[65px] h-[14.4px] w-[1.44px] rounded-l-[0.5px] bg-[#333]" />
              <div className="absolute left-0 top-[94.7px] h-[29.7px] w-[1.44px] rounded-l-[0.5px] bg-[#333]" />
              <div className="absolute left-0 top-[133px] h-[29.7px] w-[1.44px] rounded-l-[0.5px] bg-[#333]" />
              <div className="absolute right-0 top-[105.3px] h-[47.9px] w-[1.44px] rounded-r-[0.5px] bg-[#333]" />
              <div className="absolute inset-x-[11.96px] inset-y-[10.53px] overflow-hidden rounded-[19.14px] bg-white">
                <img
                  src="/zinda/main-screen-phone.webp"
                  alt={ru ? "Главный экран Zinda — мобильный" : "Zinda home screen — mobile"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute left-[65.22px] top-[8.07px] h-[13px] w-[49px] rounded-full bg-black" />
              </div>
            </div>
          </div>
          <Row className="mt-10" heading={<Eyebrow>{ru ? "Главный экран · многосчётная выкладка" : "Home screen · the multi-account layout"}</Eyebrow>}>
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Плашки расчётных счетов разных юрлиц на одной поверхности, каждая со своим балансом и статусом. Бухгалтер видит общий срез по всем бизнесам с первого экрана — без подменю и переключателей."
                : "Current-account tiles for different legal entities on a single surface, each with its own balance and status. The accountant sees an overview of every business from the first screen — no submenus, no switchers."}
            </p>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 17. Media · Сайдбар-свитчер компаний                              */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="flex flex-col md:flex-row w-full items-center gap-8 md:gap-[60px]">
          <div className="flex h-[620px] w-full md:w-[580px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] bg-[var(--c-surface)]">
            <SidebarSwitcherVisual />
          </div>
          <div className="flex max-w-[460px] flex-col items-start gap-6">
            <h3 className="text-[20px] md:text-[24px] font-semibold leading-[1.3] tracking-[-0.005em] text-[color:var(--c-text)]">
              {ru ? "Сайдбар-свитчер компаний" : "The company switcher in the sidebar"}
            </h3>
            <div className="space-y-4 text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              <p>
                {ru
                  ? "Переключение между юрлицами — в 2 клика из левого сайдбара, без потери контекста. Активная компания подсвечена, остальные доступны мгновенно."
                  : "Switching between legal entities takes 2 clicks from the left sidebar, with no loss of context. The active company is highlighted; the rest are one tap away."}
              </p>
              <p>
                {ru
                  ? "Это воплощение JTBD «единого потока работы»: бухгалтер не перелогинивается, не выбирает компанию из выпадашки, не теряет открытую вкладку — он движется между компаниями как между папками."
                  : "This is the JTBD of \"a single, uninterrupted flow\" made real: the accountant doesn't re-log in, doesn't pick a company from a dropdown, doesn't lose the open tab — they move between companies the way you move between folders."}
              </p>
            </div>
          </div>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 18. Что получилось                                                */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
                {ru ? "Что получилось" : "How it turned out"}
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru
                ? "Сигналы вместо метрик: продуктовых цифр у меня нет — после сдачи макетов в разработку доступ к проекту был закрыт."
                : "Signals instead of metrics: I don't have product numbers — access to the project was cut off once the designs were handed to development."}
            </p>
            <div className="mt-12 space-y-12">
              <Signal
                label={ru ? "Что пошло в прод" : "What shipped"}
                items={
                  ru
                    ? [
                        "Концепт согласовали с первой попытки после трёх отклонённых раундов до меня.",
                        "Архитектура многосчётности (плашки + сайдбар) ушла в финальный продукт.",
                        "Кредитные продукты ушли в постMVP, фокус удержали на сценариях со счетами.",
                        "Сроки выдержали: 4 месяца от моего захода до сдачи макетов в разработку.",
                        "Банк релизнули.",
                      ]
                    : [
                        "The concept was approved on the first try, after three rounds rejected before I joined.",
                        "The multi-account architecture (tiles + sidebar) made it into the final product.",
                        "Credit products moved to post-MVP, and we kept the focus on account workflows.",
                        "We hit the timeline: 4 months from when I joined to handing designs off to development.",
                        "The bank shipped.",
                      ]
                }
              />
              <Signal
                label={ru ? "Что не выиграл" : "What I didn't win"}
                items={
                  ru
                    ? [
                        "Визуальный тон ушёл в насыщенную консьюмерскую эстетику, против которой я аргументировал. Архитектуру сохранили, поверхностный слой — нет.",
                      ]
                    : [
                        "The visual tone drifted into a loud consumer aesthetic I'd argued against. We kept the architecture; the surface layer we didn't.",
                      ]
                }
                muted
              />
            </div>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 19. Что бы сделал иначе                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
              {ru ? "Что бы сделал иначе" : "What I'd do differently"}
            </h2>
          </Narrow>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 md:gap-y-12">
            <Lesson
              title={ru ? "Не все бои можно выиграть, когда цели стейкхолдеров полярны." : "Not every fight is winnable when stakeholders' goals are opposed."}
              body={
                ru
                  ? "Конечный заказчик-банк наши UX-решения принимал. Конфликт шёл с прокси-заказчиком-студией. Там, где это был тактический вопрос (Liquid Glass), аргументация через гайдлайны срабатывала. Там, где это была их core-цель (общий тон), мы спорили не о фактах, а о целях — UX-аргументация в принципе не могла перевесить."
                  : "The end client — the bank — accepted our UX decisions. The conflict was with the proxy client, the studio. Where it was a tactical question (Liquid Glass), an argument from guidelines worked. Where it was their core goal (the overall tone), we were arguing about goals, not facts — and UX arguments couldn't tip that in principle."
              }
            />
            <Lesson
              title={ru ? "Юзер-флоу как диагностический инструмент против легаси." : "The user flow as a diagnostic tool against legacy."}
              body={
                ru
                  ? "Не «нарисовали красивый артефакт», а через чистый флоу стали видны лишние действия и абстрактные шаги, тянувшиеся с предыдущих итераций. Это инструмент очистки, не декорация."
                  : "Not \"we drew a pretty artifact\" — a clean flow surfaced the redundant steps and hand-wavy stages carried over from earlier iterations. It's a cleanup tool, not decoration."
              }
            />
            <Lesson
              title={ru ? "Дизайнер может быть соавтором скоупа, не только исполнителем макетов." : "A designer can co-author the scope, not just produce the mockups."}
              body={
                ru
                  ? "Решение отложить кредитные продукты не пришло сверху — я внёс его через карту зависимостей. Это «дизайн соседних флоу буксует, пока в кредитке неопределённость», а не «дизайнер не хочет делать кредитку». Скоупинговый разговор — часть работы дизайнера."
                  : "The decision to defer credit products didn't come from above — I brought it forward through the dependency map. That framing is \"the adjacent flows stall while the credit card is undefined,\" not \"the designer doesn't want to do the credit card.\" The scoping conversation is part of the designer's job."
              }
            />
            <Lesson
              title={ru ? "Архитектура переживает прокси-заказчиков, отделка — нет." : "Architecture outlives proxy clients; finish doesn't."}
              body={
                ru
                  ? "Решения уровня структуры продукта проходят через стейкхолдеров с другими целями, потому что от них висит остальная разработка. Решения уровня тона и отделки легко вытесняются другой агендой. Вывод: ставь ключевые ставки в архитектуру, а не в финиш."
                  : "Product-structure decisions get through stakeholders with different goals, because the rest of development hangs off them. Tone-and-finish decisions are easily pushed aside by someone else's agenda. The takeaway: place your key bets in the architecture, not in the finish."
              }
            />
          </div>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 20. Команда                                                       */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-text)]">
                {ru ? "Команда" : "Team"}
              </h2>
            }
          >
            <div className="mt-10 space-y-8">
              <Credit
                role={ru ? "Дизайнер дизайн-системы" : "Design-system designer"}
                name="—"
                body={
                  ru
                    ? "Компоненты, токены, документация. Параллельно с моими макетами доводил систему до production-готовности."
                    : "Components, tokens, documentation. Brought the system to production readiness in parallel with my designs."
                }
              />
              <Credit
                role={ru ? "Дизайнер состояний" : "States designer"}
                name="—"
                body={
                  ru
                    ? "Краевые сценарии, ошибки, состояния. Прошёл с макетами через цикл QA-ревью."
                    : "Edge cases, errors, states. Took the designs through the QA review cycle."
                }
              />
              <Credit
                role={ru ? "Концепт-дизайнер" : "Concept designer"}
                name={ru ? "Я" : "Me"}
                body={
                  ru
                    ? "Концепт-направление, визуальный вектор, ключевые UX-решения, ресёрч. Брал на себя коммуникацию с прокси-заказчиком по архитектурным развилкам."
                    : "Concept direction, visual vector, key UX decisions, research. Owned the communication with the proxy client on the architectural forks."
                }
              />
            </div>
            <p className="mt-10 text-[13px] leading-[1.5] text-[color:var(--c-text-3)]">
              {ru
                ? "Заказчик и прокси-заказчик не указаны под NDA."
                : "The client and proxy client are not named under NDA."}
            </p>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 22. CTA                                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="rounded-[24px] bg-[var(--c-invert)] px-6 py-12 md:px-12 md:py-20">
          <div className="mx-auto max-w-[680px]">
            <p className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--c-invert-text)]">
              {ru
                ? "Готов обсудить, как сделать что-то похожее у вас"
                : "Happy to talk about building something like this for you"}
            </p>
            <div className="mt-10 flex flex-wrap items-start gap-8 md:gap-12 whitespace-nowrap">
              <a
                href="mailto:ermolt2002@gmail.com"
                className="flex flex-col items-start gap-2"
              >
                <span className="text-[13px] font-semibold leading-none text-[color:var(--c-invert-text-2)]">
                  {ru ? "Почта" : "Email"}
                </span>
                <span className="text-[22px] font-semibold leading-[1.2] text-[color:var(--c-invert-text)]">
                  ermolt2002@gmail.com
                </span>
              </a>
              <a
                href="https://t.me/darling_dsgn"
                className="flex flex-col items-start gap-2"
              >
                <span className="text-[13px] font-semibold leading-none text-[color:var(--c-invert-text-2)]">
                  {ru ? "Телеграм" : "Telegram"}
                </span>
                <span className="text-[22px] font-semibold leading-[1.2] text-[color:var(--c-invert-text)]">
                  @darling_dsgn
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Narrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[680px] ${className}`}>{children}</div>
  );
}


function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] font-semibold leading-none text-[color:var(--c-text-3)]">
      {children}
    </p>
  );
}

function ConstraintCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex flex-1 min-w-0 flex-col items-start gap-3 self-stretch overflow-hidden rounded-[16px] bg-[var(--c-surface)] p-6">
      <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-[color:var(--c-text)]">
        {label}
      </p>
      <p className="text-[14px] font-normal leading-[1.55] text-[color:var(--c-text-2)]">
        {body}
      </p>
    </div>
  );
}

function Lesson({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <p className="w-full text-[18px] font-semibold leading-[1.35] tracking-[-0.005em] text-[color:var(--c-text)]">
        {title}
      </p>
      <p className="w-full text-[16px] font-normal leading-[1.55] text-[color:var(--c-text-2)]">
        {body}
      </p>
    </div>
  );
}

function Credit({
  role,
  name,
  body,
}: {
  role: string;
  name: string;
  body: string;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <p className="w-full text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-[color:var(--c-text)]">
        {role}
      </p>
      <p className="w-full text-[14px] font-normal leading-[1.4] text-[color:var(--c-text-3)]">
        {name}
      </p>
      <p className="w-full text-[14px] font-normal leading-[1.55] text-[color:var(--c-text-2)]">
        {body}
      </p>
    </div>
  );
}

function Signal({
  label,
  items,
  muted,
}: {
  label: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-5">
      <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-[color:var(--c-text)]">
        {label}
      </p>
      <ul
        className={`flex w-full flex-col items-start gap-3 text-[18px] leading-[1.6] ${
          muted ? "text-[color:var(--c-text-2)]" : "text-[color:var(--c-text)]"
        }`}
      >
        {items.map((it, i) => (
          <li key={i} className="flex w-full items-start gap-3">
            <span className="mt-[10px] inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-current opacity-80" />
            <span className="flex-1">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarSwitcherVisual() {
  const ru = useLang().lang === "ru";
  const avatarColors = ["#5a47ae", "#23b274", "#3aa1ff"];
  return (
    <div className="flex h-[290px] w-[338px] max-w-full flex-col items-start gap-[10px]">
      <div className="flex w-[320px] max-w-full flex-col items-start gap-2 rounded-[20px] bg-white p-3 shadow-[0_2px_2px_rgba(25,28,39,0.08),0_8px_4px_rgba(25,28,39,0.07),0_18px_5.5px_rgba(25,28,39,0.04)]">
        <div className="flex h-12 w-full items-center gap-[6px] rounded-[12px] pl-[10px] pr-2">
          <div
            className="size-9 shrink-0 rounded-[15px]"
            style={{ background: "#7e6cd4" }}
          />
          <p className="flex-1 truncate text-[16px] leading-[20px] text-[#01030f]">
            Alyamov Daler Dalerovich
          </p>
          <div className="flex size-9 items-center justify-center rounded-full bg-black/[0.04]">
            <span className="size-[10px] rounded-full border border-[#01030f]/40" />
          </div>
        </div>
        <div className="h-px w-full bg-black/[0.06]" />
        <div className="flex w-full flex-col">
          <div className="flex h-12 w-full items-center gap-[6px] rounded-[12px] pl-[10px] pr-2 opacity-35">
            <div
              className="size-[22px] shrink-0 rounded-[11px]"
              style={{ background: avatarColors[0] }}
            />
            <p className="flex-1 truncate text-[16px] leading-[20px] text-[#01030f]">
              {ru ? "Технологии Будущего" : "Future Technologies"}
            </p>
            <span className="text-[#01030f]">🔒</span>
          </div>
          <div className="flex h-12 w-full items-center gap-[6px] rounded-[12px] bg-[#1e1d43]/[0.05] pl-[10px] pr-2">
            <div
              className="size-[22px] shrink-0 rounded-[11px]"
              style={{ background: avatarColors[1] }}
            />
            <p className="flex-1 truncate text-[16px] leading-[20px] text-[#01030f]">
              {ru ? "ЭкоСистемы" : "EcoSystems"}
            </p>
          </div>
          <div className="flex h-12 w-full items-center gap-[6px] rounded-[12px] pl-[10px] pr-2">
            <div
              className="size-[22px] shrink-0 rounded-[11px]"
              style={{ background: avatarColors[2] }}
            />
            <p className="flex-1 truncate text-[16px] leading-[20px] text-[#01030f]">
              {ru ? "Инновации 360" : "Innovations 360"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center gap-[6px] rounded-[32px] border border-[#1e1d43]/20 bg-[#1e1d43]/[0.07] px-2 py-2">
        <div
          className="size-7 shrink-0 rounded-[15px]"
          style={{ background: "#7e6cd4" }}
        />
        <p className="flex-1 truncate text-[12px] leading-[14px] text-[#01030f]">
          {ru ? "Название компан..." : "Company name..."}
        </p>
        <span className="text-[#01030f]/60">⇅</span>
      </div>
    </div>
  );
}

function ForkOption({
  letter,
  title,
  note,
  chosen,
}: {
  letter: string;
  title: string;
  note: string;
  chosen?: boolean;
}) {
  const bg = chosen ? "bg-[var(--c-invert)]" : "bg-[var(--c-surface)]";
  const titleColor = chosen ? "text-[color:var(--c-invert-text)]" : "text-[color:var(--c-text)]";
  const noteColor = chosen ? "text-[color:var(--c-invert-text-2)]" : "text-[color:var(--c-text-2)]";
  const letterColor = chosen ? "text-[color:var(--c-invert-text)]" : "text-[color:var(--c-text-3)]";
  return (
    <div
      className={`flex flex-1 min-w-0 flex-col items-start gap-5 self-stretch overflow-hidden rounded-[16px] p-6 ${bg}`}
    >
      <p className={`text-[13px] font-semibold leading-none ${letterColor}`}>
        {letter}
      </p>
      <p
        className={`w-full text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] ${titleColor}`}
      >
        {title}
      </p>
      <p
        className={`w-full text-[14px] font-normal leading-[1.55] ${noteColor}`}
      >
        {note}
      </p>
    </div>
  );
}

function ToneCard({
  title,
  tag,
  body,
}: {
  title: string;
  tag: string;
  body: string;
}) {
  return (
    <div className="flex flex-1 min-w-0 flex-col items-start gap-4 self-stretch overflow-hidden rounded-[16px] bg-[var(--c-surface)] p-6">
      <div className="flex w-full items-center justify-between whitespace-nowrap">
        <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-[color:var(--c-text)]">
          {title}
        </p>
        <p className="text-[12px] font-semibold leading-none text-[color:var(--c-text-3)]">
          {tag}
        </p>
      </div>
      <p className="w-full text-[14px] font-normal leading-[1.55] text-[color:var(--c-text-2)]">
        {body}
      </p>
    </div>
  );
}
