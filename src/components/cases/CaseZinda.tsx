import { ProjectCard } from "@/components/case/ProjectCard";
import { Row } from "@/components/case/Row";

export function CaseZinda() {
  return (
    <div className="zinda-page min-h-dvh w-full bg-white text-[#263238]">
      <div className="mx-auto w-full max-w-[1280px] px-6 pt-24 pb-32">
        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 1. Обзор                                                          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>Обзор</Eyebrow>
                <p className="mt-4 text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#263238]">
                  Согласовали концепт с первой попытки после трёх отклонённых
                  раундов до меня — за счёт многосчётной архитектуры под B2B-рынок
                  Таджикистана.
                </p>
              </>
            }
          >
            <ul className="flex flex-wrap items-start gap-2">
              {["Финтех · B2B", "Web + Mobile", "2025"].map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-full bg-[#eceff1] px-3.5 py-[7px] text-[13px] font-semibold leading-none text-[#263238]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Row>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 2. Hero — phone mockup + laptop hero                              */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="flex w-full items-center justify-center gap-4">
          {/* Phone mockup */}
          <div
            className="relative aspect-[326/600] h-full shrink-0 overflow-hidden rounded-[20px] bg-[#020202]"
            style={{ height: 630 }}
          >
            <img
              src="/zinda/ellipse-1.png"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -inset-[30%] h-[160%] w-[160%] object-cover"
            />
            <img
              src="/zinda/ellipse-2.png"
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
                  src="/zinda/phone-screen.png"
                  alt="Мобильный экран Zinda"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Laptop hero */}
          <div
            className="relative aspect-[800/600] shrink-0 overflow-hidden rounded-[20px]"
            style={{ height: 630 }}
          >
            <img
              src="/zinda/hero-laptop.png"
              alt="Zinda на лэптопе"
              className="absolute inset-0 h-full w-full rounded-[20px] object-cover"
            />
            <img
              src="/zinda/hero-overlay.png"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full rounded-[20px] object-cover"
            />
          </div>
        </section>

        <div className="h-20" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* Карточка проекта                                                  */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <ProjectCard
            meta={[
              {
                label: "Роль",
                value: "Концепт-дизайнер · команда из трёх · 4 месяца",
              },
              {
                label: "Контекст",
                value:
                  "Zinda TGS — первый цифровой банк Таджикистана с удалённым открытием карты. Фокус — B2B: владельцы, директора, бухгалтеры.",
              },
            ]}
            problem="Три отклонённых концептных раунда до меня. Параллельно — рынок, где один бухгалтер ведёт несколько компаний с несколькими счетами."
            solution="Многосчётный паттерн: плашки счетов на главном + сайдбар-свитчер компаний. Кредитку отложил в постMVP через карту зависимостей."
            result="Согласовали с первой попытки. Сдали макеты за 4 месяца. Банк релизнули. Архитектуру отстояли, визуальный тон — нет."
          />
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 3. Первый цифровой банк Таджикистана                              */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
                Первый цифровой банк Таджикистана с удалённым открытием карты.
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[#546e7a]">
              Zinda TGS — первый банк в стране, где карту можно открыть полностью
              удалённо, без визита в отделение. Фокус продукта — B2B-сегмент:
              владельцы бизнеса, директора с правом подписи и бухгалтеры. У
              каждой роли свои сценарии, права и мотивации. Архитектура
              многосчётности под рынок, где один бухгалтер ведёт несколько
              компаний параллельно.
            </p>
          </Row>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 4. Стартовая обстановка                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
              Стартовая обстановка
            </h2>
          </Narrow>
          <div className="mt-12 flex w-full items-stretch gap-5">
            <ConstraintCard label="NDA" body="Детали финансов и скоупа закрыты." />
            <ConstraintCard
              label="Многослойная заказная структура"
              body="Работа через прокси-заказчика с собственными эстетическими предпочтениями. Конечный заказчик-банк сам не имел чёткого видения по фичам."
            />
            <ConstraintCard
              label="Психологический фон трёх отказов"
              body="Четвёртый отказ грозил остановкой проекта."
            />
            <ConstraintCard
              label="Срок"
              body="4 месяца от моего захода до сдачи макетов в разработку."
            />
          </div>
        </section>

        <div className="h-20" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 5. Три MacBook-мокапа                                             */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="flex w-full items-start gap-8 rounded-[24px] bg-[#f3f3f3] px-6 py-10">
          {["macbook-1.png", "macbook-2.png", "macbook-3.png"].map((src) => (
            <div
              key={src}
              className="relative flex-1 aspect-[3846/2344] min-w-0"
            >
              <img
                src={`/zinda/${src}`}
                alt="Mockup интерфейса Zinda"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 6. Что мешало двинуть проект                                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
                Что мешало двинуть проект
              </h2>
            }
          >
            <div className="space-y-6 text-[18px] leading-[1.6]">
              <p className="text-[#263238]">
                Когда я подключился, у команды уже было три отклонённых концептных
                раунда. Заказчик не согласовал ни один и не мог чётко
                сформулировать почему. На входе у проекта был чек-лист фичей в
                Excel и общее направление «нужен банк уровня Тиньков».
              </p>
              <p className="text-[#263238]">
                Параллельно был вызов рынка: B2B-юзеры в Таджикистане работают в
                нестандартном для необанков паттерне. Один бухгалтер ведёт
                несколько компаний параллельно, у каждой — несколько расчётных
                счетов под разные задачи (налоги, операционка, расчёты).
                Стандартная западная схема «один основной счёт + остальные в
                подменю» сюда не переносилась.
              </p>
              <p className="text-[#546e7a]">
                Проблема была двойной: внутри проекта — застрявшая концептная
                фаза, на стороне продукта — рынок, требующий перепроектирования
                стандартных банковских паттернов.
              </p>
            </div>
          </Row>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 7. Что выцепил из проекта                                         */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
                Что выцепил из проекта
              </h2>
            }
          >
            <div className="space-y-6 text-[18px] leading-[1.6] text-[#263238]">
              <p>
                Чтобы понять, во что упёрлись предыдущие итерации, провели с
                командой 8 глубинных интервью — 4 владельца бизнеса и 4
                бухгалтера, все работавшие с банками в Таджикистане. Вопросник
                готовил я.
              </p>
              <p>
                Главный инсайт: B2B-юзер здесь живёт в многосчётной экосистеме.
                Один бухгалтер ведёт несколько компаний, у каждой — расчётные
                счета под разные задачи. Это не B2C-привычка, это
                профессиональная норма рынка.
              </p>
              <p>
                Параллельно построили чистый юзер-флоу всего сервиса. Через
                него стали видны лишние действия и абстрактные сценарии («делай
                хорошо, не делай плохо»), которые тащились с предыдущих
                итераций команды — и были одной из причин отказов заказчика.
                Юзер-флоу здесь работал как диагностический инструмент против
                легаси, не как декоративный артефакт.
              </p>
            </div>
          </Row>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 8. Главная JTBD                                                   */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row heading={<Eyebrow>Главная JTBD</Eyebrow>}>
            <p className="text-[24px] font-semibold leading-[1.3] tracking-[-0.005em] text-[#263238]">
              «Как бухгалтер, я хочу быстро переключаться между счетами разных
              бизнесов, чтобы решать задачи в режиме единого потока».
            </p>
            <p className="mt-6 text-[18px] leading-[1.6] text-[#546e7a]">
              Эта формулировка стала фундаментом архитектурных решений.
            </p>
          </Row>
        </section>

        <div className="h-20" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 9. Tile · Цепочка research → design                               */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <div className="flex w-full items-start gap-4">
            <div className="relative aspect-[1200/1396] flex-1 overflow-hidden rounded-[24px] bg-black">
              <img
                src="/zinda/research-1.png"
                alt="Карта research → design — фрагмент 1"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="relative aspect-[1200/1396] flex-1 overflow-hidden rounded-[24px] bg-black">
              <img
                src="/zinda/research-2.png"
                alt="Карта research → design — фрагмент 2"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
          <Row className="mt-10" heading={<Eyebrow>Цепочка research → design</Eyebrow>}>
            <p className="text-[18px] leading-[1.6] text-[#546e7a]">
              8 интервью → инсайт о многосчётности → JTBD «единый поток между
              счетами» → архитектурные решения. Юзер-флоу как диагностический
              инструмент против легаси предыдущих итераций.
            </p>
          </Row>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 10. Мой концепт                                                   */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
              Мой концепт
            </h2>
          </Narrow>
          <div className="mt-10 flex h-[580px] w-full items-stretch gap-4">
            {/* Left: concept laptop on stage */}
            <div className="aspect-[773/520] flex h-full shrink-0 items-end justify-center overflow-clip rounded-[24px] bg-[#f3f3f3] px-12 pt-12">
              <div className="relative h-full min-w-0 flex-1 rounded-t-[12px] bg-black shadow-[0_0_0_8px_black,0_0_0_9px_#a1a1a1]">
                <img
                  src="/zinda/concept-bento-laptop.png"
                  alt="Концепт-макет десктопного интерфейса Zinda"
                  className="absolute inset-0 h-full w-full rounded-t-[12px] object-cover"
                />
              </div>
            </div>
            {/* Right column: 2 stacked panels */}
            <div className="flex h-full min-w-0 flex-1 flex-col gap-4">
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-clip rounded-[24px] bg-[#f3f3f3] px-5">
                <img
                  src="/zinda/concept-bento-channels.png"
                  alt="Сетка карточек платёжных каналов"
                  className="block max-h-full w-full object-contain"
                />
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-clip rounded-[24px] bg-[#f3f3f3] px-5 py-4">
                <img
                  src="/zinda/concept-bento-exchange.png"
                  alt="Виджет обмена валюты"
                  className="block max-h-full w-auto object-contain"
                />
              </div>
            </div>
          </div>
          <Narrow className="mt-10">
            <p className="text-[18px] leading-[1.6] text-[#546e7a]">
              Такой концепт родился за четыре дня после начала моей работы над
              проектом. Мы полностью защитили его перед заказчиком и перешли к
              его внутреннему оформлению, к отрисовке лоу-фиделити-прототипов и
              подготовке прочих макетов.
            </p>
          </Narrow>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 11. Развилка · MVP-скоуп                                          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>Развилка</Eyebrow>
                <h2 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
                  MVP-скоуп
                </h2>
              </>
            }
          >
            <p className="text-[20px] font-medium leading-[1.4] tracking-[-0.005em] text-[#263238]">
              Что делать с кредитными продуктами, если заказчик не может
              сформулировать сценарии, а они цепляются за главную, счета и
              операции?
            </p>
          </Row>
          <div className="mt-12 flex w-full items-stretch gap-5">
            <ForkOption
              letter="A"
              title="Продолжать на текущих допущениях"
              note="Дизайнить кредитку наугад. Риск: переделывать смежные флоу, когда требования прояснятся."
            />
            <ForkOption
              letter="B"
              title="Отложить целиком и зафиксировать прозрачно"
              note="Кредитка → постMVP. Через карту зависимостей показать, что блокирует смежные флоу. Освобождает фокус на главное."
              chosen
            />
            <ForkOption
              letter="C"
              title="Угадать урезанную версию"
              note="Зафиксировать минимальный кредитный продукт от себя. Снимает блокировку, но создаёт фейковую определённость и прячет неоднозначность от заказчика."
            />
          </div>
          <div className="mt-10 rounded-[20px] bg-[#f3f3f3] px-8 py-10">
            <div className="flex w-full items-start gap-12">
              <p className="flex-1 text-[18px] font-medium leading-[1.6] text-[#263238]">
                Предложил на созвоне третий путь — через карту зависимостей, не
                через «нам сложно с кредиткой». Заказчик согласился: кредитка
                ушла в постMVP, фокус — сценарии работы со счетами.
              </p>
              <p className="flex-1 text-[16px] leading-[1.55] text-[#546e7a]">
                Цена: пришлось публично признать, что часть скоупа нельзя
                сделать без дополнительных входных данных — уязвимая позиция
                перед прокси-заказчиком.
              </p>
            </div>
          </div>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 12. Развилка · Архитектура                                        */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>Развилка</Eyebrow>
                <h2 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
                  Архитектура
                </h2>
              </>
            }
          >
            <p className="text-[20px] font-medium leading-[1.4] tracking-[-0.005em] text-[#263238]">
              Где счета живут на главном экране и как переключаешься между
              бизнесами?
            </p>
          </Row>
          <div className="mt-12 flex w-full items-stretch gap-5">
            <ForkOption
              letter="A"
              title="Западная иерархия"
              note="Один основной счёт + остальные в подменю. Знакомый паттерн необанков, но добавляет клик на каждое переключение в многосчётном сценарии."
            />
            <ForkOption
              letter="B"
              title="Равноправные плашки + сайдбар-свитчер компаний"
              note="Все счета видны одновременно на главном экране, переключение между юрлицами — одним движением из левого сайдбара."
              chosen
            />
            <ForkOption
              letter="C"
              title="Контекстный показ"
              note="Показывать только релевантные счета под текущую задачу. Перегружает интерфейс логикой угадывания и ломает предсказуемость."
            />
          </div>
          <div className="mt-10 rounded-[20px] bg-[#f3f3f3] px-8 py-10">
            <div className="flex w-full items-start gap-12">
              <p className="flex-1 text-[18px] font-medium leading-[1.6] text-[#263238]">
                Выбрал B. JTBD требует единого потока работы — иерархия
                добавляет лишний клик, контекстный показ заставляет угадывать.
                Плашки на главной + сайдбар = бухгалтер видит весь свой
                контекст и переключается одним движением.
              </p>
              <p className="flex-1 text-[16px] leading-[1.55] text-[#546e7a]">
                Цена: вышли за пределы привычной B2C-логики необанков. Пришлось
                защищать архитектуру через данные интервью, а не через «как у
                Тинькова».
              </p>
            </div>
          </div>
        </section>

        <div className="h-20" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 13. Tile · Три варианта архитектуры                               */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <div
            className="relative flex h-[580px] w-full items-stretch justify-center overflow-hidden rounded-[24px] px-[95px]"
            style={{
              background:
                "linear-gradient(270deg, rgba(147, 116, 216, 0) 0%, rgb(64, 55, 104) 100%), rgb(148, 116, 218)",
            }}
          >
            <img
              src="/zinda/three-variants.png"
              alt="Три варианта архитектуры — выбран средний"
              className="block h-full w-auto object-contain"
            />
            <span className="absolute right-[286px] top-[25.8px] text-[16px] font-semibold leading-[24px] text-white">
              Мое решение
            </span>
            <span className="absolute bottom-[17.2px] left-[166px] text-[16px] font-semibold leading-[24px] text-white">
              Версия студии
            </span>
            <span className="absolute bottom-[17.2px] left-[calc(50%-136px)] text-[16px] font-semibold leading-[24px] text-white">
              Временно консенсусное решение
            </span>
          </div>
          <Row className="mt-10" heading={<Eyebrow>Три варианта в ряд · выбран средний</Eyebrow>}>
            <p className="text-[18px] leading-[1.6] text-[#546e7a]">
              Студия хотела вверху экрана расположить логотип бренда. Я хотел
              расположить там кнопку управления компаниями, чтобы не объединять
              настройки и компанию. Но в итоге такое решение не удалось
              продавить и мы сохранили нечто среднее, что визуально не
              разбивается на два блока, неинтуитивных.
            </p>
          </Row>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 14. Развилка · Визуальный тон                                     */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>Развилка</Eyebrow>
                <h2 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
                  Визуальный тон
                </h2>
              </>
            }
          >
            <p className="text-[20px] font-medium leading-[1.4] tracking-[-0.005em] text-[#263238]">
              Конфликт с прокси-заказчиком-студией: ей нужен выразительный
              кейс в портфолио, нам — спокойный B2B-инструмент. Бой развалился
              на две части с разным исходом.
            </p>
          </Row>
          <div className="mt-12 flex h-[480px] w-full gap-5">
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-[16px] bg-[#f3f3f3] px-10">
              <img
                src="/zinda/tone-1.png"
                alt="Скриншот — версия с акцентным тоном"
                className="w-full rounded-[8px] object-cover"
              />
            </div>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-[16px] bg-[#f3f3f3] px-10">
              <img
                src="/zinda/tone-2.png"
                alt="Скриншот — версия со спокойным тоном"
                className="w-full rounded-[8px] object-cover"
              />
            </div>
          </div>
          <div className="mt-5 flex w-full items-stretch gap-5">
            <ToneCard
              title="Отказ от повсеместного Liquid Glass"
              tag="ОТСТОЯЛИ"
              body="Для студии это был тактический пункт. Аргументация через Apple HIG и конкретные проблемы реализации перевесила — отбили целиком."
            />
            <ToneCard
              title="Общий тон"
              tag="ПРОИГРАЛИ"
              body="Для студии это была их core-цель. Спорили не о фактах, а о целях. UX-аргументы про «бухгалтер по 4–6 часов в день» не пробили — у студии другая оптика. В прод вышло заметно ярче, чем оптимально для B2B."
            />
          </div>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 15. Что менялось за 4 месяца                                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
                Что менялось за 4 месяца
              </h2>
            }
          >
            <div className="space-y-6 text-[18px] leading-[1.6] text-[#263238]">
              <p>
                После согласования концепта работа разбилась на циклы:
                отрисовка → ревью с прокси-заказчиком → правки. Переломных
                точек было три.
              </p>
              <p>
                Первая — момент с MVP-скоупом: предложение отложить кредитные
                продукты через карту зависимостей. Дальше дизайн поехал без
                подвешенных мест.
              </p>
              <p>
                Вторая — циклы по визуальному тону. Постепенно стало понятно,
                что эстетический спор не выиграть полностью. Сделал ставку на
                сохранение архитектуры и тех решений, где аргумент через
                гайдлайны работал.
              </p>
              <p>
                Третья — финальная сверка с дизайн-системой и стейтами.
                Параллельно с дизайнером дизайн-системы доводили компоненты до
                production-готовности, со вторым дизайнером — крутили краевые
                состояния и ошибки.
              </p>
            </div>
          </Row>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 16. Tile · Главный экран · многосчётная выкладка                  */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <div className="flex h-[620px] w-full items-center justify-center gap-12 overflow-hidden rounded-[24px] bg-[#f4f4f4] pt-[30px]">
            <div className="flex h-full w-[851px] flex-col items-center justify-end">
              <div className="relative aspect-[2880/1800] w-full rounded-t-[12px] bg-black shadow-[0_0_0_8px_black,0_0_0_9px_#a1a1a1]">
                <img
                  src="/zinda/main-screen.png"
                  alt="Главный экран Zinda — десктоп"
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
                  src="/zinda/main-screen-phone.png"
                  alt="Главный экран Zinda — мобильный"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute left-[65.22px] top-[8.07px] h-[13px] w-[49px] rounded-full bg-black" />
              </div>
            </div>
          </div>
          <Row className="mt-10" heading={<Eyebrow>Главный экран · многосчётная выкладка</Eyebrow>}>
            <p className="text-[18px] leading-[1.6] text-[#546e7a]">
              Плашки расчётных счетов разных юрлиц на одной поверхности,
              каждая со своим балансом и статусом. Бухгалтер видит общий срез
              по всем бизнесам с первого экрана — без подменю и переключателей.
            </p>
          </Row>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 17. Media · Сайдбар-свитчер компаний                              */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="flex w-full items-center gap-[60px]">
          <div className="flex h-[620px] w-[580px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] bg-[#f4f4f4]">
            <SidebarSwitcherVisual />
          </div>
          <div className="flex max-w-[460px] flex-col items-start gap-6">
            <h3 className="text-[24px] font-semibold leading-[1.3] tracking-[-0.005em] text-[#263238]">
              Сайдбар-свитчер компаний
            </h3>
            <div className="space-y-4 text-[18px] leading-[1.6] text-[#546e7a]">
              <p>
                Переключение между юрлицами — в 2 клика из левого сайдбара,
                без потери контекста. Активная компания подсвечена, остальные
                доступны мгновенно.
              </p>
              <p>
                Это воплощение JTBD «единого потока работы»: бухгалтер не
                перелогинивается, не выбирает компанию из выпадашки, не
                теряет открытую вкладку — он движется между компаниями как
                между папками.
              </p>
            </div>
          </div>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 18. Что получилось                                                */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
                Что получилось
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[#263238]">
              Сигналы вместо метрик: продуктовых цифр у меня нет — после сдачи
              макетов в разработку доступ к проекту был закрыт.
            </p>
            <div className="mt-12 space-y-12">
              <Signal
                label="Что пошло в прод"
                items={[
                  "Концепт согласовали с первой попытки после трёх отклонённых раундов до меня.",
                  "Архитектура многосчётности (плашки + сайдбар) ушла в финальный продукт.",
                  "Кредитные продукты ушли в постMVP, фокус удержали на сценариях со счетами.",
                  "Сроки выдержали: 4 месяца от моего захода до сдачи макетов в разработку.",
                  "Банк релизнули.",
                ]}
              />
              <Signal
                label="Что не выиграл"
                items={[
                  "Визуальный тон ушёл в насыщенную консьюмерскую эстетику, против которой я аргументировал. Архитектуру сохранили, поверхностный слой — нет.",
                ]}
                muted
              />
            </div>
          </Row>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 19. Что бы сделал иначе                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
              Что бы сделал иначе
            </h2>
          </Narrow>
          <div className="mt-14 grid grid-cols-2 gap-x-10 gap-y-12">
            <Lesson
              title="Не все бои можно выиграть, когда цели стейкхолдеров полярны."
              body="Конечный заказчик-банк наши UX-решения принимал. Конфликт шёл с прокси-заказчиком-студией. Там, где это был тактический вопрос (Liquid Glass), аргументация через гайдлайны срабатывала. Там, где это была их core-цель (общий тон), мы спорили не о фактах, а о целях — UX-аргументация в принципе не могла перевесить."
            />
            <Lesson
              title="Юзер-флоу как диагностический инструмент против легаси."
              body="Не «нарисовали красивый артефакт», а через чистый флоу стали видны лишние действия и абстрактные шаги, тянувшиеся с предыдущих итераций. Это инструмент очистки, не декорация."
            />
            <Lesson
              title="Дизайнер может быть соавтором скоупа, не только исполнителем макетов."
              body="Решение отложить кредитные продукты не пришло сверху — я внёс его через карту зависимостей. Это «дизайн соседних флоу буксует, пока в кредитке неопределённость», а не «дизайнер не хочет делать кредитку». Скоупинговый разговор — часть работы дизайнера."
            />
            <Lesson
              title="Архитектура переживает прокси-заказчиков, отделка — нет."
              body="Решения уровня структуры продукта проходят через стейкхолдеров с другими целями, потому что от них висит остальная разработка. Решения уровня тона и отделки легко вытесняются другой агендой. Вывод: ставь ключевые ставки в архитектуру, а не в финиш."
            />
          </div>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 20. Команда                                                       */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#263238]">
                Команда
              </h2>
            }
          >
            <div className="mt-10 space-y-8">
              <Credit
                role="Дизайнер дизайн-системы"
                name="—"
                body="Компоненты, токены, документация. Параллельно с моими макетами доводил систему до production-готовности."
              />
              <Credit
                role="Дизайнер состояний"
                name="—"
                body="Краевые сценарии, ошибки, состояния. Прошёл с макетами через цикл QA-ревью."
              />
              <Credit
                role="Концепт-дизайнер"
                name="Я"
                body="Концепт-направление, визуальный вектор, ключевые UX-решения, ресёрч. Брал на себя коммуникацию с прокси-заказчиком по архитектурным развилкам."
              />
            </div>
            <p className="mt-10 text-[13px] leading-[1.5] text-[#90a4ae]">
              Заказчик и прокси-заказчик не указаны под NDA.
            </p>
          </Row>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 22. CTA                                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="rounded-[24px] bg-[#263238] px-12 py-20">
          <div className="mx-auto max-w-[680px]">
            <p className="text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-white">
              Готов обсудить, как сделать что-то похожее у вас
            </p>
            <div className="mt-10 flex flex-wrap items-start gap-12 whitespace-nowrap">
              <a
                href="mailto:timi@example.ru"
                className="flex flex-col items-start gap-2"
              >
                <span className="text-[13px] font-semibold leading-none text-[#99a6b2]">
                  Почта
                </span>
                <span className="text-[22px] font-semibold leading-[1.2] text-white">
                  timi@example.ru
                </span>
              </a>
              <a
                href="https://t.me/timi"
                className="flex flex-col items-start gap-2"
              >
                <span className="text-[13px] font-semibold leading-none text-[#99a6b2]">
                  Телеграм
                </span>
                <span className="text-[22px] font-semibold leading-[1.2] text-white">
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
    <p className="text-[14px] font-semibold leading-none text-[#90a4ae]">
      {children}
    </p>
  );
}

function ConstraintCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex flex-1 min-w-0 flex-col items-start gap-3 self-stretch overflow-hidden rounded-[16px] bg-[#f3f3f3] p-6">
      <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-[#263238]">
        {label}
      </p>
      <p className="text-[14px] font-normal leading-[1.55] text-[#546e7a]">
        {body}
      </p>
    </div>
  );
}

function Lesson({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <p className="w-full text-[18px] font-semibold leading-[1.35] tracking-[-0.005em] text-[#263238]">
        {title}
      </p>
      <p className="w-full text-[16px] font-normal leading-[1.55] text-[#546e7a]">
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
      <p className="w-full text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-[#263238]">
        {role}
      </p>
      <p className="w-full text-[14px] font-normal leading-[1.4] text-[#90a4ae]">
        {name}
      </p>
      <p className="w-full text-[14px] font-normal leading-[1.55] text-[#546e7a]">
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
      <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-[#263238]">
        {label}
      </p>
      <ul
        className={`flex w-full flex-col items-start gap-3 text-[18px] leading-[1.6] ${
          muted ? "text-[#546e7a]" : "text-[#263238]"
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
  const avatarColors = ["#5a47ae", "#23b274", "#3aa1ff"];
  return (
    <div className="flex h-[290px] w-[338px] flex-col items-start gap-[10px]">
      <div className="flex w-[320px] flex-col items-start gap-2 rounded-[20px] bg-white p-3 shadow-[0_2px_2px_rgba(25,28,39,0.08),0_8px_4px_rgba(25,28,39,0.07),0_18px_5.5px_rgba(25,28,39,0.04)]">
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
              Технологии Будущего
            </p>
            <span className="text-[#01030f]">🔒</span>
          </div>
          <div className="flex h-12 w-full items-center gap-[6px] rounded-[12px] bg-[#1e1d43]/[0.05] pl-[10px] pr-2">
            <div
              className="size-[22px] shrink-0 rounded-[11px]"
              style={{ background: avatarColors[1] }}
            />
            <p className="flex-1 truncate text-[16px] leading-[20px] text-[#01030f]">
              ЭкоСистемы
            </p>
          </div>
          <div className="flex h-12 w-full items-center gap-[6px] rounded-[12px] pl-[10px] pr-2">
            <div
              className="size-[22px] shrink-0 rounded-[11px]"
              style={{ background: avatarColors[2] }}
            />
            <p className="flex-1 truncate text-[16px] leading-[20px] text-[#01030f]">
              Инновации 360
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
          Название компан...
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
  const bg = chosen ? "bg-[#222]" : "bg-[#f3f3f3]";
  const titleColor = chosen ? "text-white" : "text-[#263238]";
  const noteColor = chosen ? "text-[#d9e0eb]" : "text-[#546e7a]";
  const letterColor = chosen ? "text-white" : "text-[#90a4ae]";
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
    <div className="flex flex-1 min-w-0 flex-col items-start gap-4 self-stretch overflow-hidden rounded-[16px] bg-[#f3f3f3] p-6">
      <div className="flex w-full items-center justify-between whitespace-nowrap">
        <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-[#263238]">
          {title}
        </p>
        <p className="text-[12px] font-semibold leading-none text-[#90a4ae]">
          {tag}
        </p>
      </div>
      <p className="w-full text-[14px] font-normal leading-[1.55] text-[#546e7a]">
        {body}
      </p>
    </div>
  );
}
