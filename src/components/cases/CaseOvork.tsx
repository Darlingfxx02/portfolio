import { Row } from "@/components/case/Row";
import { useLang } from "@/lib/i18n";

export function CaseOvork() {
  const { lang } = useLang();
  const ru = lang === "ru";
  return (
    <div className="ovork-page min-h-dvh w-full bg-[var(--c-page)] text-[color:var(--c-text)]">
      <div className="mx-auto w-full max-w-[1280px] px-5 pt-16 pb-24 md:px-6 md:pt-24 md:pb-32">
        {/* 01 · Обзор */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Обзор" : "Overview"}</Eyebrow>
                <h1 className="mt-4 text-[26px] md:text-[36px] font-semibold leading-[1.1] tracking-[-0.72px] text-[color:var(--c-text)]">
                  {ru
                    ? "Довёл кошелёк ОВорк до требований ФНС, не сломав еженедельный релизный ритм — и пересобрал раздел в систему, которая снимает недоверие пользователя к выплатам."
                    : "Brought the OVork wallet up to Russian tax-authority requirements without breaking a weekly release cadence — and rebuilt the section into a system that dissolves users' distrust of payouts."}
                </h1>
              </>
            }
          >
            <ul className="flex flex-wrap gap-[8px]">
              {(ru
                ? ["Финтех · самозанятые", "Mobile", "2025 — 2026"]
                : ["Fintech · gig workers", "Mobile", "2025 — 2026"]
              ).map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-full bg-[var(--c-surface-2)] px-[14px] py-[7px] text-[13px] font-semibold leading-none text-[color:var(--c-text)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* 02 · Hero — макеты */}
        <section className="flex w-full flex-col md:flex-row items-center justify-center gap-6 md:gap-[16px]">
          <HeroPhone
            src="/ovork/hero-1.webp"
            alt={ru ? "Главный экран ОВорк с баннером ФНС" : "OVork home screen with the tax-authority banner"}
            blobs={[
              { img: "/ovork/blob-a.svg", left: -208, top: 499, w: 450, h: 450 },
              { img: "/ovork/blob-a.svg", left: 29, top: -123, w: 450, h: 450 },
            ]}
          />
          <HeroPhone
            src="/ovork/hero-2.webp"
            alt={ru ? "Экран кошелька ОВорк со структурой баланса" : "OVork wallet screen with the structured balance"}
            blobs={[
              { img: "/ovork/blob-b.svg", left: -458, top: -182, w: 584, h: 450 },
              { img: "/ovork/blob-a.svg", left: 159, top: 137, w: 450, h: 450 },
            ]}
          />
          <HeroPhone
            src="/ovork/hero-3.webp"
            alt={ru ? "Уведомление о поступившем платеже в ОВорк" : "Incoming-payment notification in OVork"}
            blobs={[
              { img: "/ovork/blob-a.svg", left: -225, top: 116, w: 450, h: 450 },
            ]}
          />
        </section>

        <div className="h-20 md:h-40" />

        {/* 03 · Кошелёк внутри живого продукта */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-text)]">
                {ru
                  ? "Кошелёк внутри живого продукта с релизами раз в 5–10 дней."
                  : "A wallet inside a live product that ships every 5–10 days."}
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "ОВорк — мобильное приложение для исполнителей-самозанятых в гиг-аутсорсе линейного персонала. Раздел кошелька подхватил у ушедшей коллеги. Кроме меня в команде на проекте — только арт-директор. Контур ответственности end-to-end: концепция, развилки, макеты, юр-ревью, согласование с арт-директором перед сдачей."
                : "OVork is a mobile app for self-employed gig workers staffing frontline roles. I picked up the wallet section from a colleague who'd left. Besides me, the only other person on the project was the art director. My ownership was end-to-end: concept, decision forks, mockups, legal review, and sign-off with the art director before delivery."}
            </p>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 04 · Четыре рамки */}
        <section className="flex w-full flex-col items-start">
          <Narrow>
            <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-text)]">
              {ru
                ? "Четыре рамки, в которых работал раздел"
                : "Four constraints the section had to live within"}
            </h2>
          </Narrow>
          <div className="mt-[48px] flex w-full flex-col md:flex-row items-start gap-4 md:gap-[20px]">
            <ConstraintCard
              label={ru ? "Релизный ритм" : "Release cadence"}
              body={ru
                ? "Версия раз в 5–10 дней. Большие пересборки дробились на серию маленьких релизных шагов."
                : "A new build every 5–10 days. Big rebuilds had to be broken into a series of small, shippable steps."}
            />
            <ConstraintCard
              label={ru ? "ФНС" : "Tax authority"}
              body={ru
                ? "Регулятор формулирует уровень видимости задолженности. Спор «но это плохо для UX» не работает."
                : "The regulator dictates how visible tax debt must be. Arguing “but that's bad for UX” gets you nowhere."}
            />
            <ConstraintCard
              label={ru ? "ГПХ и банк" : "Contracts and bank"}
              body={ru
                ? "Каждое изменение проходило через юристов клиента. ~30% первых решений возвращались с правками."
                : "Every change ran through the client's lawyers. Roughly 30% of my first-pass solutions came back with edits."}
            />
            <ConstraintCard
              label={ru ? "Унаследованные паттерны" : "Inherited patterns"}
              body={ru
                ? "Часть визуального языка собрана предшественницей и арт-директором. Развить раздел, не разрывая ткань."
                : "Part of the visual language was built by my predecessor and the art director. I had to evolve the section without tearing the fabric."}
            />
          </div>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 05 · Развилки */}
        <section className="flex w-full flex-col items-start">
          <Row heading={<Eyebrow>{ru ? "Развилки" : "Decision forks"}</Eyebrow>}>
            <p className="text-[20px] md:text-[24px] font-semibold leading-[1.3] tracking-[-0.12px] text-[color:var(--c-text)]">
              {ru
                ? "Как впустить ФНС в интерфейс, не разрушив остальной UX."
                : "How to let the tax authority into the interface without wrecking the rest of the UX."}
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Через два месяца после моего прихода пришли уточнённые требования регулятора. Повысить видимость задолженности и сделать раздел уведомлений доступным за один тап с главного — две разные задачи, но обе про одно: как сделать регуляторно-обязательную информацию видимой, не сломав то, что уже работает."
                : "Two months after I joined, the regulator's requirements were tightened. Raising the visibility of tax debt and making notifications reachable in one tap from the home screen were two separate tasks — but both came down to the same thing: how to make legally mandatory information visible without breaking what already worked."}
            </p>
          </Row>
        </section>

        <div className="h-[48px] md:h-[80px]" />

        {/* 06 · Развилка A */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Развилка A" : "Fork A"}</Eyebrow>
                <h2 className="mt-[16px] text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-text)]">
                  {ru
                    ? "Куда поставить уведомление о задолженности ФНС"
                    : "Where to place the tax-debt notice"}
                </h2>
              </>
            }
          >
            <p className="w-full md:w-[505px] text-[18px] leading-[1.5] text-[color:var(--c-text-2)]">
              {ru
                ? "Регулятор требует постоянной видимости. Продукт требует не мешать пользователю искать смены."
                : "The regulator demands constant visibility. The product demands not getting in the way of users looking for shifts."}
            </p>
          </Row>
          <div className="mt-[48px] flex w-full flex-col md:flex-row items-start gap-4 md:gap-[20px]">
            <ForkCard
              letter="A"
              title={ru ? "Только в «Кошельке», когда есть долг" : "Only in the Wallet, when there's debt"}
              note={ru
                ? "Не закрывает требование — пользователь может месяцами не заходить в раздел."
                : "Doesn't satisfy the requirement — a user might not open the section for months."}
            />
            <ForkCard
              letter="B"
              chosen
              title={ru ? "Персистентный баннер в шапке всех экранов" : "A persistent banner in the header of every screen"}
              note={ru
                ? "Самая ненасильственная форма постоянной видимости. Виден всегда, не блокирует действия, исчезает после оплаты."
                : "The least forceful form of constant visibility. Always present, never blocks actions, disappears once paid."}
            />
            <ForkCard
              letter="C"
              title={ru ? "Блокирующая модалка при старте сессии" : "A blocking modal at the start of the session"}
              note={ru
                ? "Превращает приложение в коллектор. Блокирует основной сценарий ради регуляторного требования."
                : "Turns the app into a debt collector. Blocks the core flow for the sake of a regulatory requirement."}
            />
          </div>
          <Box
            left={ru
              ? "Баннер — единственный вариант, который держит видимость без блокировки."
              : "The banner is the only option that holds visibility without blocking."}
            right={ru
              ? "Цена: часть бюджета шапки на всех экранах. Спор с фронтом про hide-on-scroll закрыл sticky-поведением — юр-ревью подтвердил, что прятание при скролле создаёт регуляторный риск."
              : "The cost: a slice of the header budget on every screen. I settled the hide-on-scroll debate with the front-end team by making it sticky — legal review confirmed that hiding it on scroll would create a regulatory risk."}
          />
        </section>

        <div className="h-[48px] md:h-[80px]" />

        {/* 07 · Tile — главный экран до/после */}
        <section className="flex w-full flex-col items-start">
          <div className="flex w-full flex-col md:flex-row items-start gap-4 md:gap-[16px]">
            <div className="flex h-[560px] flex-1 items-center justify-center overflow-hidden rounded-[24px] bg-[var(--c-surface)] p-[24px]">
              <Phone
                src="/ovork/tile07-1.webp"
                alt={ru ? "Старый главный экран — «Три шага до отклика»" : "Old home screen — “Three steps to apply”"}
              />
            </div>
            <div className="flex h-[560px] flex-1 items-center justify-center overflow-hidden rounded-[24px] bg-[var(--c-surface)] p-[24px]">
              <Phone
                src="/ovork/hero-1.webp"
                alt={ru ? "Новый главный экран с баннером ФНС в шапке" : "New home screen with the tax-authority banner in the header"}
              />
            </div>
          </div>
          <Row
            className="mt-[40px]"
            heading={<Eyebrow>{ru ? "Главный экран до и после" : "Home screen, before and after"}</Eyebrow>}
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Side-by-side сравнение прежней и новой иерархии топ-бара. Раньше там жил статус «онлайн / готов к смене» — ужал до иконки, чтобы впустить баннер."
                : "A side-by-side of the old and new top-bar hierarchy. The “online / ready for a shift” status used to live there — I shrank it to an icon to make room for the banner."}
            </p>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 08 · Развилка B */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Развилка B · параллельно" : "Fork B · in parallel"}</Eyebrow>
                <h2 className="mt-[16px] text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-text)]">
                  {ru
                    ? "Уведомления — из профиля в шапку главного"
                    : "Notifications — from the profile to the home-screen header"}
                </h2>
              </>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru
                ? "Регулятор требовал не «можно найти», а «доступно за один тап с главного». Отдельную вкладку в таб-баре отбросил — раздувает навигацию ради непостоянной задачи. Иконка в шапке с badge — один тап с главного, без перестройки таб-бара."
                : "The regulator asked not for “findable” but for “reachable in one tap from the home screen.” I ruled out a dedicated tab-bar item — it would bloat navigation for a non-constant task. A header icon with a badge is one tap from home, with no rebuild of the tab bar."}
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Цена: иконка конкурирует с баннером ФНС за бюджет шапки. Пришлось пересобрать иерархию топ-бара с нуля — порядок чтения, размеры, контрасты — чтобы регуляторные элементы сосуществовали с CTA «Найти смену». Самый аккуратный пиксель-уровневый кусок работы во всём проекте."
                : "The cost: the icon competes with the tax-authority banner for header budget. I had to rebuild the top-bar hierarchy from scratch — reading order, sizes, contrast — so the regulatory elements could coexist with the “Find a shift” CTA. The most meticulous pixel-level work in the whole project."}
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "В первый месяц ~15% пользователей всё ещё открывали уведомления через профиль по старой привычке. Нормальная цена миграции."
                : "In the first month, ~15% of users still opened notifications through the profile out of old habit. A normal cost of migration."}
            </p>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 09 · Обратная задача */}
        <section className="flex w-full flex-col items-start">
          <Row heading={<Eyebrow>{ru ? "Обратная задача" : "The inverse problem"}</Eyebrow>}>
            <p className="text-[20px] md:text-[24px] font-semibold leading-[1.3] tracking-[-0.12px] text-[color:var(--c-text)]">
              {ru
                ? "Два флоу, которые я делал намеренно неудобными."
                : "Two flows I made deliberately inconvenient."}
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "В финтехе для самозанятых это не баг, а функция. Некоторые сценарии бизнес и регулятор хотят, чтобы существовали — но использовались редко."
                : "In fintech for gig workers, that's not a bug — it's a feature. Some flows the business and the regulator want to exist, but to be used rarely."}
            </p>
          </Row>
        </section>

        <div className="h-[48px] md:h-[80px]" />

        {/* 10 · Развилка C */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Развилка C" : "Fork C"}</Eyebrow>
                <h2 className="mt-[16px] text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-text)]">
                  {ru ? "Аннулирование чека в ФНС" : "Voiding a tax receipt"}
                </h2>
              </>
            }
          >
            <p className="w-full md:w-[524px] text-[18px] leading-[1.5] text-[color:var(--c-text-2)]">
              {ru
                ? "Регулятор требует видимости функции. Бизнес-логика обратная: чем реже её нажимают — тем спокойнее."
                : "The regulator requires the feature to be visible. The business logic is the opposite: the less it's tapped, the better."}
            </p>
          </Row>
          <div className="mt-[48px] flex w-full flex-col md:flex-row items-start gap-4 md:gap-[20px]">
            <ForkCard
              letter="A"
              title={ru ? "Кнопка + одна модалка" : "A button plus a single modal"}
              note={ru
                ? "Регулярно нажимается случайно при сканировании ленты большим пальцем."
                : "Gets tapped by accident all the time while thumbing through the feed."}
            />
            <ForkCard
              letter="B"
              chosen
              title={ru ? "Двухшаговое подтверждение через осознанный выбор причины" : "Two-step confirmation via a deliberate reason choice"}
              note={ru
                ? "Тап «аннулировать» → экран с выбором причины из списка и кнопкой подтверждения. Функция видима, случайная активация исключена."
                : "Tap “void” → a screen where you pick a reason from a list and confirm. The feature stays visible; accidental activation is ruled out."}
            />
            <ForkCard
              letter="C"
              title={ru ? "Спрятать в подменю / поддержку" : "Bury it in a submenu / support"}
              note={ru
                ? "Нарушает требование «функция доступна пользователю» — юр-ревью не пропустит."
                : "Breaks the “the feature is available to the user” requirement — legal review would never pass it."}
            />
          </div>
          <Box
            left={ru
              ? "Трение не равно скрытие. Функция остаётся на видном месте, но выбор причины — не пустой confirm, а осознанная пауза."
              : "Friction isn't the same as hiding. The feature stays in plain sight, but picking a reason isn't an empty confirm — it's a deliberate pause."}
            right={ru
              ? "Цена ошибки в этом флоу — необратимое аннулирование чека с последствиями для ФНС-отчётности — сильно выше цены замедления."
              : "The cost of a mistake in this flow — irreversibly voiding a receipt, with consequences for tax reporting — is far higher than the cost of slowing the user down."}
          />
        </section>

        <div className="h-[48px] md:h-[80px]" />

        {/* 11 · Tile — два экрана аннулирования */}
        <section className="flex w-full flex-col items-start">
          <div className="flex h-auto md:h-[620px] w-full flex-col md:flex-row items-center justify-center gap-8 md:gap-[64px] py-8 md:py-0 overflow-hidden rounded-[24px] bg-[var(--c-surface)]">
            <Phone
              src="/ovork/annul-1.webp"
              alt={ru ? "Лента операций — тап «аннулировать»" : "Transaction feed — tapping “void”"}
            />
            <Phone
              src="/ovork/annul-2.webp"
              alt={ru ? "Выбор причины аннулирования" : "Choosing a reason for voiding"}
            />
            <Phone
              src="/ovork/annul-3.webp"
              alt={ru ? "Подтверждение аннулирования чека" : "Confirming the receipt void"}
            />
          </div>
          <Row
            className="mt-[40px]"
            heading={<Eyebrow>{ru ? "Двухшаговое аннулирование" : "Two-step voiding"}</Eyebrow>}
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Второй шаг — не пустой confirm, а осознанный выбор причины из списка. Это и даёт пользователю паузу, и решает требование осмысленности действия — без лишних шагов и блокирующих модалок."
                : "The second step isn't an empty confirm — it's a deliberate choice of reason from a list. That both gives the user a pause and satisfies the “the action must be intentional” requirement, without extra steps or blocking modals."}
            </p>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 12 · Развилка D */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Развилка D · параллельно" : "Fork D · in parallel"}</Eyebrow>
                <h2 className="mt-[16px] text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-text)]">
                  {ru
                    ? "Вывод средств — шаблоны для своих карт, ручной ввод для чужих"
                    : "Withdrawals — saved templates for your own cards, manual entry for others'"}
                </h2>
              </>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru
                ? "Со стороны регулятора переводы на собственные карты выглядят чисто, СБП на чужие реквизиты — потенциальный красный флаг. Убирать СБП целиком — ломает UX для пользователей без привязанной карты. Равные варианты — не двигают поведение."
                : "From the regulator's angle, transfers to your own cards look clean, while faster-payment transfers to someone else's details are a potential red flag. Removing faster payments entirely breaks the UX for users without a linked card. Making the two options equal does nothing to shift behavior."}
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru
                ? "Решение — асимметричное трение на уровне ввода реквизитов. Собственные карты пользователя сохраняются как шаблоны после первого ввода — следующий вывод идёт в один тап. Перевод на чужой номер требует вручную вбивать реквизиты каждый раз. Шаблоны для чужих карт не сохраняются."
                : "The solution: asymmetric friction at the point of entering details. A user's own cards are saved as templates after the first entry — the next withdrawal is a single tap. A transfer to someone else's number requires typing the details in by hand every time. Templates for other people's cards are never saved."}
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Это soft-nudge не через предупреждающие модалки, а через цену ввода: путь к своим картам — мгновенный, к чужим — каждый раз осознанный. Параллельно готовил макеты под следующую итерацию — верификация принадлежности карты как обязательное условие вывода. До релиза на моём этапе не дошло, но флоу проектировался с расчётом на неё."
                : "It's a soft nudge — not through warning modals, but through the cost of entry: the path to your own cards is instant, the path to others' is deliberate every time. In parallel I prepared mockups for the next iteration — verifying card ownership as a mandatory condition of withdrawal. It didn't ship during my stint, but the flow was designed with it in mind."}
            </p>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 13 · Принцип */}
        <section className="flex w-full flex-col items-start">
          <Row heading={<Eyebrow>{ru ? "Принцип, к которому пришёл за проект" : "The principle I arrived at over this project"}</Eyebrow>}>
            <p className="text-[20px] md:text-[24px] font-semibold leading-[1.3] tracking-[-0.12px] text-[color:var(--c-text)]">
              {ru
                ? "Функцию нельзя прятать, если она требуется регулятором — но можно проектировать её скорость. Скорость UI — такой же design lever, как иерархия или цвет."
                : "You can't hide a feature the regulator requires — but you can design its speed. The speed of a UI is as much a design lever as hierarchy or color."}
            </p>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 14 · Финальное решение */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-text)]">
                {ru
                  ? "Четыре артефакта, из которых сложился раздел"
                  : "The four artifacts the section came together from"}
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Раздел собирался не одним релизом, а серией шагов в рамках релизного ритма клиента. Четыре ключевых артефакта, каждый закрывает конкретный фрагмент проблемы."
                : "The section didn't ship in one release — it was built across a series of steps within the client's release cadence. Four key artifacts, each closing a specific piece of the problem."}
            </p>
          </Row>
        </section>

        <div className="h-[48px] md:h-[80px]" />

        {/* 14.1 · Главный экран */}
        <section className="flex w-full flex-col items-start">
          <Tile>
            <Phone src="/ovork/hero-1.webp" alt={ru ? "Главный экран с баннером ФНС" : "Home screen with the tax-authority banner"} />
            <Phone src="/ovork/main-2.webp" alt={ru ? "Профиль с уведомлениями" : "Profile with notifications"} />
            <Phone
              src="/ovork/main-3.webp"
              alt={ru ? "Главный экран с иконкой уведомлений" : "Home screen with the notifications icon"}
            />
          </Tile>
          <Row
            className="mt-[40px]"
            heading={<Eyebrow>{ru ? "01 · Главный экран" : "01 · Home screen"}</Eyebrow>}
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "При задолженности — sticky-баннер с суммой и кнопкой быстрого перехода к погашению. Параллельно иконка уведомлений с badge. Иерархия шапки пересобрана с нуля, чтобы регуляторные элементы сосуществовали с основным CTA."
                : "When there's debt, a sticky banner shows the amount with a shortcut to pay it off. Alongside it, a notifications icon with a badge. The header hierarchy was rebuilt from scratch so the regulatory elements could coexist with the primary CTA."}
            </p>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 14.2 · Универсальный компонент уведомления */}
        <section className="flex w-full flex-col items-start">
          <Tile>
            <Phone src="/ovork/notif-1.webp" alt={ru ? "Уведомление — полный режим" : "Notification — full mode"} />
            <Phone
              src="/ovork/notif-2.webp"
              alt={ru ? "Уведомление — финансовый режим" : "Notification — financial mode"}
            />
            <Phone
              src="/ovork/notif-3.webp"
              alt={ru ? "Уведомление — финансовый режим со скидкой" : "Notification — financial mode with a discount"}
            />
            <Phone src="/ovork/notif-4.webp" alt={ru ? "Уведомление — сжатый режим" : "Notification — compact mode"} />
          </Tile>
          <Row
            className="mt-[40px]"
            heading={<Eyebrow>{ru ? "02 · Универсальный компонент уведомления" : "02 · A universal notification component"}</Eyebrow>}
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru
                ? "До меня каждый тип уведомления делался отдельной вёрсткой. Перепроектировал как один компонент с тремя режимами рендера: полный (заголовок + подзаголовок + тело), сжатый (адаптация по числу строк) и финансовый (акцент на сумму)."
                : "Before me, every notification type was laid out from scratch. I redesigned it as a single component with three render modes: full (title + subtitle + body), compact (adapting to the number of lines), and financial (emphasizing the amount)."}
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Эффект: команда клиента перестала приходить за «новой вёрсткой под новый тип». Все будущие события от ФНС, банка и внутренних триггеров укладываются в существующий компонент."
                : "The effect: the client's team stopped coming back for “a new layout for a new type.” Every future event — from the tax authority, the bank, or internal triggers — fits the existing component."}
            </p>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 14.3 · Структура баланса */}
        <section className="flex w-full flex-col items-start">
          <Tile>
            <Phone
              src="/ovork/balance-1.webp"
              alt={ru ? "Экран кошелька — чек формируется" : "Wallet screen — receipt being generated"}
            />
            <Phone
              src="/ovork/balance-2.webp"
              alt={ru ? "Экран кошелька — детали выплаты" : "Wallet screen — payout details"}
            />
            <Phone
              src="/ovork/balance-3.webp"
              alt={ru ? "Экран кошелька — ошибка загрузки чека" : "Wallet screen — receipt failed to load"}
            />
          </Tile>
          <Row
            className="mt-[40px]"
            heading={<Eyebrow>{ru ? "03 · Структура баланса" : "03 · Balance structure"}</Eyebrow>}
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru
                ? "Переход от одной цифры баланса к структуре состояний: «доступно к выводу», «в обработке», «удержано». Прямой ответ на инсайт из ресёрча — пользователь читает «баланс» как «что мне должны», и любое расхождение между заработанным и доступным вызывает ощущение, что приложение его обманывает."
                : "Moving from a single balance figure to a structure of states: “available to withdraw,” “processing,” “on hold.” A direct answer to a research insight — users read “balance” as “what I'm owed,” and any gap between what they earned and what's available makes it feel like the app is cheating them."}
            </p>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 15 · Что получилось */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-text)]">
                {ru ? "Что получилось" : "What came out of it"}
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru
                ? "Для агентской работы качественные результаты важнее цифр — они напрямую отвечают на «оправдала ли студия деньги клиента»."
                : "For agency work, the qualitative results matter more than the numbers — they answer the question that counts: did the studio earn the client's money?"}
            </p>
            <p className="mt-[48px] text-[18px] font-semibold leading-[1.3] tracking-[-0.09px] text-[color:var(--c-text)]">
              {ru ? "Качественные результаты" : "Qualitative results"}
            </p>
            <ul className="mt-[20px] flex flex-col gap-[12px]">
              {(ru
                ? [
                    "Все регуляторные требования ФНС закрыты в срок — главный KPI клиента в квартале.",
                    "Релизный ритм клиента (раз в 5–10 дней) не сорван ни на одном шаге.",
                    "Универсальный компонент уведомлений вошёл в дизайн-систему и переиспользован арт-директором в других разделах.",
                    "Несколько крупных тикетов саппорта «куда делись мои деньги» перестали воспроизводиться после выкатки структурированного баланса.",
                  ]
                : [
                    "All tax-authority requirements met on time — the client's top KPI for the quarter.",
                    "The client's release cadence (every 5–10 days) wasn't missed at a single step.",
                    "The universal notification component made it into the design system and was reused by the art director in other sections.",
                    "Several major “where did my money go” support tickets stopped recurring after the structured balance shipped.",
                  ]
              ).map((item) => (
                <li key={item} className="flex items-start gap-[12px]">
                  <span className="mt-[10px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--c-text)] opacity-80" />
                  <span className="flex-1 text-[18px] leading-[1.6] text-[color:var(--c-text)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* 16 · Метрики */}
        <section className="flex w-full flex-col items-start">
          <Row heading={<Eyebrow>{ru ? "Метрики · вспомогательные" : "Metrics · supporting"}</Eyebrow>}>
            <div className="flex flex-col border-t border-[color:var(--c-border)]">
              <MetricRow
                label={ru ? "Доля «денежных» обращений в саппорте" : "Share of “money” tickets in support"}
                unit="%"
                before="41"
                after="19"
                accent
              />
              <MetricRow
                label={ru ? "Конверсия в успешный первый вывод" : "Conversion to a successful first withdrawal"}
                unit="%"
                before="71"
                after="89"
                accent
              />
              <MetricRow
                label={ru ? "Среднее время до первого вывода" : "Average time to first withdrawal"}
                unit={ru ? "дней" : "days"}
                before={ru ? "4,2" : "4.2"}
                after={ru ? "1,6" : "1.6"}
                accent
              />
              <MetricRow
                label={ru ? "CSAT раздела по внутреннему опросу" : "Section CSAT from the internal survey"}
                unit="1–5"
                before={ru ? "3,9" : "3.9"}
                after={ru ? "4,4" : "4.4"}
                accent
              />
              <MetricRow
                label={ru ? "App Store rating приложения за период" : "App Store rating over the period"}
                unit="1–5"
                before={ru ? "4,3" : "4.3"}
                after={ru ? "4,7" : "4.7"}
              />
            </div>
            <div className="mt-[32px] border-l-2 border-[color:var(--c-border)] pl-[16px]">
              <p className="text-[15px] leading-[1.55] text-[color:var(--c-text-3)]">
                {ru
                  ? "Оговорка по последней цифре: рост рейтинга — заслуга всей команды клиента, не только моя. По тематике отзывов кошелёк сдвинул оценку примерно на +0,2."
                  : "A caveat on the last figure: the rating bump is the whole client team's doing, not just mine. Judging by the review topics, the wallet moved the score by roughly +0.2."}
              </p>
            </div>
            <p className="mt-[40px] text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              <span className="font-semibold text-[color:var(--c-text)]">
                {ru ? "Что осталось вне моей зоны:" : "What stayed outside my scope:"}
              </span>{" "}
              {ru
                ? "полная пересборка флоу вывода передавалась дальше после ротации. Раздел документов трогал точечно — основную работу там вёл арт-директор."
                : "the full rebuild of the withdrawal flow was handed off after a rotation. I touched the documents section only in spots — the bulk of that work was led by the art director."}
            </p>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 17 · Что бы сделал иначе */}
        <section className="flex w-full flex-col items-start">
          <Narrow>
            <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-text)]">
              {ru ? "Что бы сделал иначе" : "What I'd do differently"}
            </h2>
          </Narrow>
          <div className="mt-[56px] grid w-full grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-8 md:gap-y-[48px]">
            <Lesson
              title={ru ? "Юр-ревью на ранних этапах." : "Legal review earlier."}
              body={ru
                ? "Первые две итерации терял на возвратах от комплаенса, потому что носил готовые высокоточные макеты. Теперь завожу юристов в файл на стадии лоу-фай вайрфреймов."
                : "I lost the first two iterations to compliance sending things back, because I was bringing them finished high-fidelity mockups. Now I bring the lawyers into the file at the low-fi wireframe stage."}
            />
            <Lesson
              title={ru ? "Универсальный компонент — с самого начала." : "A universal component from the start."}
              body={ru
                ? "Первые типы уведомлений делал как разовые вёрстки и переделывал ретроспективно. Урок: даже когда задача выглядит точечной, проверь, не семейство ли это."
                : "I built the first notification types as one-offs and had to redo them in hindsight. The lesson: even when a task looks like a one-off, check whether it's really a family."}
            />
            <Lesson
              title={ru ? "Передача от предшественницы." : "The handoff from my predecessor."}
              body={ru
                ? "После ухода коллеги не было сессии разбора её решений. Часть логики восстанавливал через файлы и разговоры с разработчиками — замедлило первый месяц."
                : "After my colleague left, there was no session to walk through her decisions. I reconstructed part of the logic from files and conversations with the developers — which slowed down my first month."}
            />
            <Lesson
              title={ru ? "Базовая линия метрик — в первые две недели." : "A metrics baseline in the first two weeks."}
              body={ru
                ? "Половину стартовых чисел восстанавливал через продакт-аналитика клиента уже в процессе. Теперь фиксирую базовую линию сразу."
                : "I had to reconstruct half of the starting numbers through the client's product analyst midway through. Now I lock in the baseline right away."}
            />
          </div>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 18 · Карточка проекта */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-text)]">
                {ru ? "Карточка проекта" : "Project card"}
              </h2>
            }
          >
            <div className="flex flex-col">
              <Fact
                label={ru ? "Роль" : "Role"}
                value={ru
                  ? "Product Designer (middle) · на стороне дизайн-студии · 2025 — 2026"
                  : "Product Designer (mid-level) · on the design-studio side · 2025 — 2026"}
                first
              />
              <Fact
                label={ru ? "Команда" : "Team"}
                value={ru
                  ? "Арт-директор и я. Раздел кошелька подхватил у ушедшей коллеги."
                  : "The art director and me. I picked up the wallet section from a colleague who'd left."}
              />
              <Fact
                label={ru ? "Контекст" : "Context"}
                value={ru
                  ? "ОВорк — мобильное приложение для исполнителей-самозанятых в гиг-аутсорсе линейного персонала. Релизы раз в 5–10 дней."
                  : "OVork is a mobile app for self-employed gig workers staffing frontline roles. Releases every 5–10 days."}
              />
              <Fact
                label={ru ? "Проблема" : "Problem"}
                value={ru
                  ? "Раздел не закрывал требований ФНС (видимость задолженности, доступ к уведомлениям) и не снимал базового недоверия пользователя к выплатам."
                  : "The section didn't meet the tax authority's requirements (visibility of debt, access to notifications) and did nothing to dispel users' basic distrust of payouts."}
              />
              <Fact
                label={ru ? "Решение" : "Solution"}
                value={ru
                  ? "Персистентный баннер ФНС. Перенос уведомлений из профиля на главный. Универсальный компонент с тремя режимами рендера. Двухшаговое аннулирование чеков через выбор причины. Шаблоны для своих карт + ручной ввод для чужих как асимметричное трение в выводе."
                  : "A persistent tax-authority banner. Moving notifications from the profile to the home screen. A universal component with three render modes. Two-step receipt voiding via a reason choice. Saved templates for your own cards plus manual entry for others' as asymmetric friction in withdrawals."}
              />
              <Fact
                label={ru ? "Результат" : "Result"}
                value={ru
                  ? "Регуляторные требования закрыты в срок, релизный ритм не сорван. Тикеты 41% → 19%, конверсия 71% → 89%, время до вывода 4,2 → 1,6 дня."
                  : "Regulatory requirements met on time, release cadence never missed. Tickets 41% → 19%, conversion 71% → 89%, time to withdrawal 4.2 → 1.6 days."}
              />
            </div>
          </Row>
        </section>

        <div className="h-[80px] md:h-[160px]" />

        {/* 19 · CTA */}
        <section className="flex w-full flex-col items-center rounded-[24px] bg-[var(--c-invert)] px-6 py-12 md:px-[48px] md:py-[80px]">
          <div className="w-full max-w-[680px]">
            <p className="text-[24px] md:text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[color:var(--c-invert-text)]">
              {ru
                ? "Готов обсудить, как сделать что-то похожее у вас"
                : "Happy to talk through how to build something like this for you"}
            </p>
            <div className="mt-[40px] flex flex-wrap gap-8 md:gap-[48px] whitespace-nowrap">
              <a
                href="mailto:timi@example.ru"
                className="flex flex-col gap-[8px]"
              >
                <span className="text-[13px] font-semibold leading-none text-[color:var(--c-invert-text-2)]">
                  {ru ? "Почта" : "Email"}
                </span>
                <span className="text-[22px] font-semibold leading-[1.2] text-[color:var(--c-invert-text)]">
                  timi@example.ru
                </span>
              </a>
              <a href="https://t.me/timi" className="flex flex-col gap-[8px]">
                <span className="text-[13px] font-semibold leading-none text-[color:var(--c-invert-text-2)]">
                  {ru ? "Телеграм" : "Telegram"}
                </span>
                <span className="text-[22px] font-semibold leading-[1.2] text-[color:var(--c-invert-text)]">
                  @timi
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                 */
/* ─────────────────────────────────────────────────────────────────────── */

function Narrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-[680px] ${className}`}>{children}</div>
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
    <div className="flex min-w-0 flex-1 flex-col gap-[12px] self-stretch rounded-[16px] bg-[var(--c-surface)] p-[24px]">
      <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.09px] text-[color:var(--c-text)]">
        {label}
      </p>
      <p className="text-[14px] leading-[1.55] text-[color:var(--c-text-2)]">{body}</p>
    </div>
  );
}

function ForkCard({
  letter,
  title,
  note,
  chosen = false,
}: {
  letter: string;
  title: string;
  note: string;
  chosen?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col gap-[20px] self-stretch rounded-[16px] p-[24px] ${
        chosen ? "bg-[var(--c-invert)]" : "bg-[var(--c-surface)]"
      }`}
    >
      <p
        className={`text-[13px] font-semibold leading-none ${
          chosen ? "text-[color:var(--c-invert-text)]" : "text-[color:var(--c-text-3)]"
        }`}
      >
        {letter}
      </p>
      <p
        className={`text-[18px] font-semibold leading-[1.3] tracking-[-0.09px] ${
          chosen ? "text-[color:var(--c-invert-text)]" : "text-[color:var(--c-text)]"
        }`}
      >
        {title}
      </p>
      <p
        className={`text-[14px] leading-[1.55] ${
          chosen ? "text-[color:var(--c-invert-text-2)]" : "text-[color:var(--c-text-2)]"
        }`}
      >
        {note}
      </p>
    </div>
  );
}

function Box({ left, right }: { left: string; right: string }) {
  return (
    <div className="mt-[40px] flex w-full flex-col md:flex-row items-start gap-8 md:gap-[48px] rounded-[20px] bg-[var(--c-surface)] px-6 py-8 md:px-[32px] md:py-[40px]">
      <p className="flex-1 text-[18px] font-medium leading-[1.6] text-[color:var(--c-text)]">
        {left}
      </p>
      <p className="flex-1 text-[16px] leading-[1.55] text-[color:var(--c-text-2)]">
        {right}
      </p>
    </div>
  );
}

function MetricRow({
  label,
  unit,
  before,
  after,
  accent = false,
}: {
  label: string;
  unit: string;
  before: string;
  after: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-[16px] border-b border-[color:var(--c-border)] py-[24px]">
      <p className="min-w-0 flex-1 text-[16px] font-medium leading-[1.4] text-[color:var(--c-text)]">
        {label}
      </p>
      <p className="w-[60px] text-right text-[12px] font-medium leading-none text-[color:var(--c-text-3)]">
        {unit}
      </p>
      <p className="w-[80px] text-right text-[22px] font-medium leading-none tracking-[-0.22px] text-[color:var(--c-text-3)]">
        {before}
      </p>
      <p className="w-[24px] text-center text-[16px] font-medium leading-none text-[color:var(--c-text-2)]">
        →
      </p>
      <p
        className={`w-[80px] text-right text-[22px] font-semibold leading-none tracking-[-0.22px] ${
          accent ? "text-[color:var(--c-warm)]" : "text-[color:var(--c-text)]"
        }`}
      >
        {after}
      </p>
    </div>
  );
}

function Lesson({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-[12px]">
      <p className="text-[18px] font-semibold leading-[1.35] tracking-[-0.09px] text-[color:var(--c-text)]">
        {title}
      </p>
      <p className="text-[16px] leading-[1.55] text-[color:var(--c-text-2)]">{body}</p>
    </div>
  );
}

function Fact({
  label,
  value,
  first = false,
}: {
  label: string;
  value: string;
  first?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-6 md:gap-[40px] py-[20px] ${
        first ? "" : "border-t border-[color:var(--c-border)]"
      }`}
    >
      <p className="w-[120px] shrink-0 text-[14px] font-semibold leading-[1.5] text-[color:var(--c-text-3)]">
        {label}
      </p>
      <p className="flex-1 text-[18px] leading-[1.6] text-[color:var(--c-text)]">
        {value}
      </p>
    </div>
  );
}

function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-auto md:h-[693px] w-full flex-col md:flex-row items-center justify-center gap-8 md:gap-[32px] overflow-hidden rounded-[24px] bg-[var(--c-surface)] p-6 md:p-[24px]">
      {children}
    </div>
  );
}

function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-[410px] w-[204px] shrink-0 overflow-hidden rounded-[28px] border border-white/50 bg-[#1a1a1a]">
      <div className="absolute left-[5px] top-[5px] h-[398px] w-[192px] overflow-hidden rounded-[22px] bg-[#1a1a1a]">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute left-1/2 top-[8px] h-[13px] w-[49px] -translate-x-1/2 rounded-[8px] bg-black" />
      </div>
    </div>
  );
}

type BlobSpec = { img: string; left: number; top: number; w: number; h: number };

function HeroPhone({
  src,
  alt,
  blobs,
}: {
  src: string;
  alt: string;
  blobs: BlobSpec[];
}) {
  return (
    <div className="relative flex h-[630px] w-[342px] max-w-full shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[var(--c-invert-deep)]">
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: b.left, top: b.top, width: b.w, height: b.h }}
        >
          <div className="absolute" style={{ inset: -500 }}>
            <img
              src={b.img}
              alt=""
              loading="lazy"
              className="block h-full w-full"
            />
          </div>
        </div>
      ))}
      <Phone src={src} alt={alt} />
    </div>
  );
}
