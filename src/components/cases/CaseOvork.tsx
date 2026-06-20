import { Row } from "@/components/case/Row";

export function CaseOvork() {
  return (
    <div className="ovork-page min-h-dvh w-full bg-white text-[#263238]">
      <div className="mx-auto w-full max-w-[1280px] px-6 pt-24 pb-32">
        {/* 01 · Обзор */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <>
                <Eyebrow>Обзор</Eyebrow>
                <h1 className="mt-4 text-[36px] font-semibold leading-[1.1] tracking-[-0.72px] text-[#263238]">
                  Довёл кошелёк ОВорк до требований ФНС, не сломав еженедельный
                  релизный ритм — и пересобрал раздел в систему, которая снимает
                  недоверие пользователя к выплатам.
                </h1>
              </>
            }
          >
            <ul className="flex flex-wrap gap-[8px]">
              {["Финтех · самозанятые", "Mobile", "2025 — 2026"].map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-full bg-[#eceff1] px-[14px] py-[7px] text-[13px] font-semibold leading-none text-[#263238]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Row>
        </section>

        <div className="h-40" />

        {/* 02 · Hero — макеты */}
        <section className="flex w-full items-center justify-center gap-[16px]">
          <HeroPhone
            src="/ovork/hero-1.png"
            alt="Главный экран ОВорк с баннером ФНС"
            blobs={[
              { img: "/ovork/blob-a.svg", left: -208, top: 499, w: 450, h: 450 },
              { img: "/ovork/blob-a.svg", left: 29, top: -123, w: 450, h: 450 },
            ]}
          />
          <HeroPhone
            src="/ovork/hero-2.png"
            alt="Экран кошелька ОВорк со структурой баланса"
            blobs={[
              { img: "/ovork/blob-b.svg", left: -458, top: -182, w: 584, h: 450 },
              { img: "/ovork/blob-a.svg", left: 159, top: 137, w: 450, h: 450 },
            ]}
          />
          <HeroPhone
            src="/ovork/hero-3.png"
            alt="Уведомление о поступившем платеже в ОВорк"
            blobs={[
              { img: "/ovork/blob-a.svg", left: -225, top: 116, w: 450, h: 450 },
            ]}
          />
        </section>

        <div className="h-40" />

        {/* 03 · Кошелёк внутри живого продукта */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[#263238]">
                Кошелёк внутри живого продукта с релизами раз в 5–10 дней.
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[#546e7a]">
              ОВорк — мобильное приложение для исполнителей-самозанятых в
              гиг-аутсорсе линейного персонала. Раздел кошелька подхватил у
              ушедшей коллеги. Кроме меня в команде на проекте — только
              арт-директор. Контур ответственности end-to-end: концепция,
              развилки, макеты, юр-ревью, согласование с арт-директором перед
              сдачей.
            </p>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 04 · Четыре рамки */}
        <section className="flex w-full flex-col items-start">
          <Narrow>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[#263238]">
              Четыре рамки, в которых работал раздел
            </h2>
          </Narrow>
          <div className="mt-[48px] flex w-full items-start gap-[20px]">
            <ConstraintCard
              label="Релизный ритм"
              body="Версия раз в 5–10 дней. Большие пересборки дробились на серию маленьких релизных шагов."
            />
            <ConstraintCard
              label="ФНС"
              body="Регулятор формулирует уровень видимости задолженности. Спор «но это плохо для UX» не работает."
            />
            <ConstraintCard
              label="ГПХ и банк"
              body="Каждое изменение проходило через юристов клиента. ~30% первых решений возвращались с правками."
            />
            <ConstraintCard
              label="Унаследованные паттерны"
              body="Часть визуального языка собрана предшественницей и арт-директором. Развить раздел, не разрывая ткань."
            />
          </div>
        </section>

        <div className="h-[160px]" />

        {/* 05 · Развилки */}
        <section className="flex w-full flex-col items-start">
          <Row heading={<Eyebrow>Развилки</Eyebrow>}>
            <p className="text-[24px] font-semibold leading-[1.3] tracking-[-0.12px] text-[#263238]">
              Как впустить ФНС в интерфейс, не разрушив остальной UX.
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[#546e7a]">
              Через два месяца после моего прихода пришли уточнённые требования
              регулятора. Повысить видимость задолженности и сделать раздел
              уведомлений доступным за один тап с главного — две разные задачи,
              но обе про одно: как сделать регуляторно-обязательную информацию
              видимой, не сломав то, что уже работает.
            </p>
          </Row>
        </section>

        <div className="h-[80px]" />

        {/* 06 · Развилка A */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <>
                <Eyebrow>Развилка A</Eyebrow>
                <h2 className="mt-[16px] text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[#263238]">
                  Куда поставить уведомление о задолженности ФНС
                </h2>
              </>
            }
          >
            <p className="w-[505px] text-[18px] leading-[1.5] text-[#546e7a]">
              Регулятор требует постоянной видимости. Продукт требует не мешать
              пользователю искать смены.
            </p>
          </Row>
          <div className="mt-[48px] flex w-full items-start gap-[20px]">
            <ForkCard
              letter="A"
              title="Только в «Кошельке», когда есть долг"
              note="Не закрывает требование — пользователь может месяцами не заходить в раздел."
            />
            <ForkCard
              letter="B"
              chosen
              title="Персистентный баннер в шапке всех экранов"
              note="Самая ненасильственная форма постоянной видимости. Виден всегда, не блокирует действия, исчезает после оплаты."
            />
            <ForkCard
              letter="C"
              title="Блокирующая модалка при старте сессии"
              note="Превращает приложение в коллектор. Блокирует основной сценарий ради регуляторного требования."
            />
          </div>
          <Box
            left="Баннер — единственный вариант, который держит видимость без блокировки."
            right="Цена: часть бюджета шапки на всех экранах. Спор с фронтом про hide-on-scroll закрыл sticky-поведением — юр-ревью подтвердил, что прятание при скролле создаёт регуляторный риск."
          />
        </section>

        <div className="h-[80px]" />

        {/* 07 · Tile — главный экран до/после */}
        <section className="flex w-full flex-col items-start">
          <div className="flex w-full items-start gap-[16px]">
            <div className="flex h-[560px] flex-1 items-center justify-center overflow-hidden rounded-[24px] bg-[#f4f4f4] p-[24px]">
              <Phone
                src="/ovork/tile07-1.png"
                alt="Старый главный экран — «Три шага до отклика»"
              />
            </div>
            <div className="flex h-[560px] flex-1 items-center justify-center overflow-hidden rounded-[24px] bg-[#f4f4f4] p-[24px]">
              <Phone
                src="/ovork/hero-1.png"
                alt="Новый главный экран с баннером ФНС в шапке"
              />
            </div>
          </div>
          <Row
            className="mt-[40px]"
            heading={<Eyebrow>Главный экран до и после</Eyebrow>}
          >
            <p className="text-[18px] leading-[1.6] text-[#546e7a]">
              Side-by-side сравнение прежней и новой иерархии топ-бара. Раньше
              там жил статус «онлайн / готов к смене» — ужал до иконки, чтобы
              впустить баннер.
            </p>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 08 · Развилка B */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <>
                <Eyebrow>Развилка B · параллельно</Eyebrow>
                <h2 className="mt-[16px] text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[#263238]">
                  Уведомления — из профиля в шапку главного
                </h2>
              </>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[#263238]">
              Регулятор требовал не «можно найти», а «доступно за один тап с
              главного». Отдельную вкладку в таб-баре отбросил — раздувает
              навигацию ради непостоянной задачи. Иконка в шапке с badge — один
              тап с главного, без перестройки таб-бара.
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[#546e7a]">
              Цена: иконка конкурирует с баннером ФНС за бюджет шапки. Пришлось
              пересобрать иерархию топ-бара с нуля — порядок чтения, размеры,
              контрасты — чтобы регуляторные элементы сосуществовали с CTA
              «Найти смену». Самый аккуратный пиксель-уровневый кусок работы во
              всём проекте.
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[#546e7a]">
              В первый месяц ~15% пользователей всё ещё открывали уведомления
              через профиль по старой привычке. Нормальная цена миграции.
            </p>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 09 · Обратная задача */}
        <section className="flex w-full flex-col items-start">
          <Row heading={<Eyebrow>Обратная задача</Eyebrow>}>
            <p className="text-[24px] font-semibold leading-[1.3] tracking-[-0.12px] text-[#263238]">
              Два флоу, которые я делал намеренно неудобными.
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[#546e7a]">
              В финтехе для самозанятых это не баг, а функция. Некоторые
              сценарии бизнес и регулятор хотят, чтобы существовали — но
              использовались редко.
            </p>
          </Row>
        </section>

        <div className="h-[80px]" />

        {/* 10 · Развилка C */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <>
                <Eyebrow>Развилка C</Eyebrow>
                <h2 className="mt-[16px] text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[#263238]">
                  Аннулирование чека в ФНС
                </h2>
              </>
            }
          >
            <p className="w-[524px] text-[18px] leading-[1.5] text-[#546e7a]">
              Регулятор требует видимости функции. Бизнес-логика обратная: чем
              реже её нажимают — тем спокойнее.
            </p>
          </Row>
          <div className="mt-[48px] flex w-full items-start gap-[20px]">
            <ForkCard
              letter="A"
              title="Кнопка + одна модалка"
              note="Регулярно нажимается случайно при сканировании ленты большим пальцем."
            />
            <ForkCard
              letter="B"
              chosen
              title="Двухшаговое подтверждение через осознанный выбор причины"
              note="Тап «аннулировать» → экран с выбором причины из списка и кнопкой подтверждения. Функция видима, случайная активация исключена."
            />
            <ForkCard
              letter="C"
              title="Спрятать в подменю / поддержку"
              note="Нарушает требование «функция доступна пользователю» — юр-ревью не пропустит."
            />
          </div>
          <Box
            left="Трение не равно скрытие. Функция остаётся на видном месте, но выбор причины — не пустой confirm, а осознанная пауза."
            right="Цена ошибки в этом флоу — необратимое аннулирование чека с последствиями для ФНС-отчётности — сильно выше цены замедления."
          />
        </section>

        <div className="h-[80px]" />

        {/* 11 · Tile — два экрана аннулирования */}
        <section className="flex w-full flex-col items-start">
          <div className="flex h-[620px] w-full items-center justify-center gap-[64px] overflow-hidden rounded-[24px] bg-[#f4f4f4]">
            <Phone
              src="/ovork/annul-1.png"
              alt="Лента операций — тап «аннулировать»"
            />
            <Phone
              src="/ovork/annul-2.png"
              alt="Выбор причины аннулирования"
            />
            <Phone
              src="/ovork/annul-3.png"
              alt="Подтверждение аннулирования чека"
            />
          </div>
          <Row
            className="mt-[40px]"
            heading={<Eyebrow>Двухшаговое аннулирование</Eyebrow>}
          >
            <p className="text-[18px] leading-[1.6] text-[#546e7a]">
              Второй шаг — не пустой confirm, а осознанный выбор причины из
              списка. Это и даёт пользователю паузу, и решает требование
              осмысленности действия — без лишних шагов и блокирующих модалок.
            </p>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 12 · Развилка D */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <>
                <Eyebrow>Развилка D · параллельно</Eyebrow>
                <h2 className="mt-[16px] text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[#263238]">
                  Вывод средств — шаблоны для своих карт, ручной ввод для чужих
                </h2>
              </>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[#263238]">
              Со стороны регулятора переводы на собственные карты выглядят
              чисто, СБП на чужие реквизиты — потенциальный красный флаг.
              Убирать СБП целиком — ломает UX для пользователей без привязанной
              карты. Равные варианты — не двигают поведение.
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[#263238]">
              Решение — асимметричное трение на уровне ввода реквизитов.
              Собственные карты пользователя сохраняются как шаблоны после
              первого ввода — следующий вывод идёт в один тап. Перевод на чужой
              номер требует вручную вбивать реквизиты каждый раз. Шаблоны для
              чужих карт не сохраняются.
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[#546e7a]">
              Это soft-nudge не через предупреждающие модалки, а через цену
              ввода: путь к своим картам — мгновенный, к чужим — каждый раз
              осознанный. Параллельно готовил макеты под следующую итерацию —
              верификация принадлежности карты как обязательное условие вывода.
              До релиза на моём этапе не дошло, но флоу проектировался с
              расчётом на неё.
            </p>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 13 · Принцип */}
        <section className="flex w-full flex-col items-start">
          <Row heading={<Eyebrow>Принцип, к которому пришёл за проект</Eyebrow>}>
            <p className="text-[24px] font-semibold leading-[1.3] tracking-[-0.12px] text-[#263238]">
              Функцию нельзя прятать, если она требуется регулятором — но можно
              проектировать её скорость. Скорость UI — такой же design lever,
              как иерархия или цвет.
            </p>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 14 · Финальное решение */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[#263238]">
                Четыре артефакта, из которых сложился раздел
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[#546e7a]">
              Раздел собирался не одним релизом, а серией шагов в рамках
              релизного ритма клиента. Четыре ключевых артефакта, каждый
              закрывает конкретный фрагмент проблемы.
            </p>
          </Row>
        </section>

        <div className="h-[80px]" />

        {/* 14.1 · Главный экран */}
        <section className="flex w-full flex-col items-start">
          <Tile>
            <Phone src="/ovork/hero-1.png" alt="Главный экран с баннером ФНС" />
            <Phone src="/ovork/main-2.png" alt="Профиль с уведомлениями" />
            <Phone
              src="/ovork/main-3.png"
              alt="Главный экран с иконкой уведомлений"
            />
          </Tile>
          <Row
            className="mt-[40px]"
            heading={<Eyebrow>01 · Главный экран</Eyebrow>}
          >
            <p className="text-[18px] leading-[1.6] text-[#546e7a]">
              При задолженности — sticky-баннер с суммой и кнопкой быстрого
              перехода к погашению. Параллельно иконка уведомлений с badge.
              Иерархия шапки пересобрана с нуля, чтобы регуляторные элементы
              сосуществовали с основным CTA.
            </p>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 14.2 · Универсальный компонент уведомления */}
        <section className="flex w-full flex-col items-start">
          <Tile>
            <Phone src="/ovork/notif-1.png" alt="Уведомление — полный режим" />
            <Phone
              src="/ovork/notif-2.png"
              alt="Уведомление — финансовый режим"
            />
            <Phone
              src="/ovork/notif-3.png"
              alt="Уведомление — финансовый режим со скидкой"
            />
            <Phone src="/ovork/notif-4.png" alt="Уведомление — сжатый режим" />
          </Tile>
          <Row
            className="mt-[40px]"
            heading={<Eyebrow>02 · Универсальный компонент уведомления</Eyebrow>}
          >
            <p className="text-[18px] leading-[1.6] text-[#263238]">
              До меня каждый тип уведомления делался отдельной вёрсткой.
              Перепроектировал как один компонент с тремя режимами рендера:
              полный (заголовок + подзаголовок + тело), сжатый (адаптация по
              числу строк) и финансовый (акцент на сумму).
            </p>
            <p className="mt-[24px] text-[18px] leading-[1.6] text-[#546e7a]">
              Эффект: команда клиента перестала приходить за «новой вёрсткой
              под новый тип». Все будущие события от ФНС, банка и внутренних
              триггеров укладываются в существующий компонент.
            </p>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 14.3 · Структура баланса */}
        <section className="flex w-full flex-col items-start">
          <Tile>
            <Phone
              src="/ovork/balance-1.png"
              alt="Экран кошелька — чек формируется"
            />
            <Phone
              src="/ovork/balance-2.png"
              alt="Экран кошелька — детали выплаты"
            />
            <Phone
              src="/ovork/balance-3.png"
              alt="Экран кошелька — ошибка загрузки чека"
            />
          </Tile>
          <Row
            className="mt-[40px]"
            heading={<Eyebrow>03 · Структура баланса</Eyebrow>}
          >
            <p className="text-[18px] leading-[1.6] text-[#263238]">
              Переход от одной цифры баланса к структуре состояний: «доступно
              к выводу», «в обработке», «удержано». Прямой ответ на инсайт из
              ресёрча — пользователь читает «баланс» как «что мне должны», и
              любое расхождение между заработанным и доступным вызывает
              ощущение, что приложение его обманывает.
            </p>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 15 · Что получилось */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[#263238]">
                Что получилось
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[#263238]">
              Для агентской работы качественные результаты важнее цифр — они
              напрямую отвечают на «оправдала ли студия деньги клиента».
            </p>
            <p className="mt-[48px] text-[18px] font-semibold leading-[1.3] tracking-[-0.09px] text-[#263238]">
              Качественные результаты
            </p>
            <ul className="mt-[20px] flex flex-col gap-[12px]">
              {[
                "Все регуляторные требования ФНС закрыты в срок — главный KPI клиента в квартале.",
                "Релизный ритм клиента (раз в 5–10 дней) не сорван ни на одном шаге.",
                "Универсальный компонент уведомлений вошёл в дизайн-систему и переиспользован арт-директором в других разделах.",
                "Несколько крупных тикетов саппорта «куда делись мои деньги» перестали воспроизводиться после выкатки структурированного баланса.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-[12px]">
                  <span className="mt-[10px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#263238] opacity-80" />
                  <span className="flex-1 text-[18px] leading-[1.6] text-[#263238]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Row>
        </section>

        <div className="h-40" />

        {/* 16 · Метрики */}
        <section className="flex w-full flex-col items-start">
          <Row heading={<Eyebrow>Метрики · вспомогательные</Eyebrow>}>
            <div className="flex flex-col border-t border-[#eceff1]">
              <MetricRow
                label="Доля «денежных» обращений в саппорте"
                unit="%"
                before="41"
                after="19"
                accent
              />
              <MetricRow
                label="Конверсия в успешный первый вывод"
                unit="%"
                before="71"
                after="89"
                accent
              />
              <MetricRow
                label="Среднее время до первого вывода"
                unit="дней"
                before="4,2"
                after="1,6"
                accent
              />
              <MetricRow
                label="CSAT раздела по внутреннему опросу"
                unit="1–5"
                before="3,9"
                after="4,4"
                accent
              />
              <MetricRow
                label="App Store rating приложения за период"
                unit="1–5"
                before="4,3"
                after="4,7"
              />
            </div>
            <div className="mt-[32px] border-l-2 border-[#eceff1] pl-[16px]">
              <p className="text-[15px] leading-[1.55] text-[#90a4ae]">
                Оговорка по последней цифре: рост рейтинга — заслуга всей
                команды клиента, не только моя. По тематике отзывов кошелёк
                сдвинул оценку примерно на +0,2.
              </p>
            </div>
            <p className="mt-[40px] text-[18px] leading-[1.6] text-[#546e7a]">
              <span className="font-semibold text-[#263238]">
                Что осталось вне моей зоны:
              </span>{" "}
              полная пересборка флоу вывода передавалась дальше после ротации.
              Раздел документов трогал точечно — основную работу там вёл
              арт-директор.
            </p>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 17 · Что бы сделал иначе */}
        <section className="flex w-full flex-col items-start">
          <Narrow>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[#263238]">
              Что бы сделал иначе
            </h2>
          </Narrow>
          <div className="mt-[56px] grid w-full grid-cols-2 gap-x-[40px] gap-y-[48px]">
            <Lesson
              title="Юр-ревью на ранних этапах."
              body="Первые две итерации терял на возвратах от комплаенса, потому что носил готовые высокоточные макеты. Теперь завожу юристов в файл на стадии лоу-фай вайрфреймов."
            />
            <Lesson
              title="Универсальный компонент — с самого начала."
              body="Первые типы уведомлений делал как разовые вёрстки и переделывал ретроспективно. Урок: даже когда задача выглядит точечной, проверь, не семейство ли это."
            />
            <Lesson
              title="Передача от предшественницы."
              body="После ухода коллеги не было сессии разбора её решений. Часть логики восстанавливал через файлы и разговоры с разработчиками — замедлило первый месяц."
            />
            <Lesson
              title="Базовая линия метрик — в первые две недели."
              body="Половину стартовых чисел восстанавливал через продакт-аналитика клиента уже в процессе. Теперь фиксирую базовую линию сразу."
            />
          </div>
        </section>

        <div className="h-[160px]" />

        {/* 18 · Карточка проекта */}
        <section className="flex w-full flex-col items-start">
          <Row
            heading={
              <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-[#263238]">
                Карточка проекта
              </h2>
            }
          >
            <div className="flex flex-col">
              <Fact
                label="Роль"
                value="Product Designer (middle) · на стороне дизайн-студии · 2025 — 2026"
                first
              />
              <Fact
                label="Команда"
                value="Арт-директор и я. Раздел кошелька подхватил у ушедшей коллеги."
              />
              <Fact
                label="Контекст"
                value="ОВорк — мобильное приложение для исполнителей-самозанятых в гиг-аутсорсе линейного персонала. Релизы раз в 5–10 дней."
              />
              <Fact
                label="Проблема"
                value="Раздел не закрывал требований ФНС (видимость задолженности, доступ к уведомлениям) и не снимал базового недоверия пользователя к выплатам."
              />
              <Fact
                label="Решение"
                value="Персистентный баннер ФНС. Перенос уведомлений из профиля на главный. Универсальный компонент с тремя режимами рендера. Двухшаговое аннулирование чеков через выбор причины. Шаблоны для своих карт + ручной ввод для чужих как асимметричное трение в выводе."
              />
              <Fact
                label="Результат"
                value="Регуляторные требования закрыты в срок, релизный ритм не сорван. Тикеты 41% → 19%, конверсия 71% → 89%, время до вывода 4,2 → 1,6 дня."
              />
            </div>
          </Row>
        </section>

        <div className="h-[160px]" />

        {/* 19 · CTA */}
        <section className="flex w-full flex-col items-center rounded-[24px] bg-[#263238] px-[48px] py-[80px]">
          <div className="w-full max-w-[680px]">
            <p className="text-[32px] font-semibold leading-[1.1] tracking-[-0.32px] text-white">
              Готов обсудить, как сделать что-то похожее у вас
            </p>
            <div className="mt-[40px] flex flex-wrap gap-[48px] whitespace-nowrap">
              <a
                href="mailto:timi@example.ru"
                className="flex flex-col gap-[8px]"
              >
                <span className="text-[13px] font-semibold leading-none text-[#99a6b2]">
                  Почта
                </span>
                <span className="text-[22px] font-semibold leading-[1.2] text-white">
                  timi@example.ru
                </span>
              </a>
              <a href="https://t.me/timi" className="flex flex-col gap-[8px]">
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
    <p className="text-[14px] font-semibold leading-none text-[#90a4ae]">
      {children}
    </p>
  );
}

function ConstraintCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[12px] self-stretch rounded-[16px] bg-[#f3f3f3] p-[24px]">
      <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.09px] text-[#263238]">
        {label}
      </p>
      <p className="text-[14px] leading-[1.55] text-[#546e7a]">{body}</p>
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
        chosen ? "bg-[#222222]" : "bg-[#f3f3f3]"
      }`}
    >
      <p
        className={`text-[13px] font-semibold leading-none ${
          chosen ? "text-white" : "text-[#90a4ae]"
        }`}
      >
        {letter}
      </p>
      <p
        className={`text-[18px] font-semibold leading-[1.3] tracking-[-0.09px] ${
          chosen ? "text-white" : "text-[#263238]"
        }`}
      >
        {title}
      </p>
      <p
        className={`text-[14px] leading-[1.55] ${
          chosen ? "text-[#d9e0eb]" : "text-[#546e7a]"
        }`}
      >
        {note}
      </p>
    </div>
  );
}

function Box({ left, right }: { left: string; right: string }) {
  return (
    <div className="mt-[40px] flex w-full items-start gap-[48px] rounded-[20px] bg-[#f3f3f3] px-[32px] py-[40px]">
      <p className="flex-1 text-[18px] font-medium leading-[1.6] text-[#263238]">
        {left}
      </p>
      <p className="flex-1 text-[16px] leading-[1.55] text-[#546e7a]">
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
    <div className="flex items-center gap-[16px] border-b border-[#eceff1] py-[24px]">
      <p className="min-w-0 flex-1 text-[16px] font-medium leading-[1.4] text-[#263238]">
        {label}
      </p>
      <p className="w-[60px] text-right text-[12px] font-medium leading-none text-[#90a4ae]">
        {unit}
      </p>
      <p className="w-[80px] text-right text-[22px] font-medium leading-none tracking-[-0.22px] text-[#90a4ae]">
        {before}
      </p>
      <p className="w-[24px] text-center text-[16px] font-medium leading-none text-[#546e7a]">
        →
      </p>
      <p
        className={`w-[80px] text-right text-[22px] font-semibold leading-none tracking-[-0.22px] ${
          accent ? "text-[#b3380a]" : "text-[#263238]"
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
      <p className="text-[18px] font-semibold leading-[1.35] tracking-[-0.09px] text-[#263238]">
        {title}
      </p>
      <p className="text-[16px] leading-[1.55] text-[#546e7a]">{body}</p>
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
      className={`flex items-start gap-[40px] py-[20px] ${
        first ? "" : "border-t border-[#eceff1]"
      }`}
    >
      <p className="w-[120px] shrink-0 text-[14px] font-semibold leading-[1.5] text-[#90a4ae]">
        {label}
      </p>
      <p className="flex-1 text-[18px] leading-[1.6] text-[#263238]">
        {value}
      </p>
    </div>
  );
}

function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[693px] w-full items-center justify-center gap-[32px] overflow-hidden rounded-[24px] bg-[#f4f4f4] p-[24px]">
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
    <div className="relative flex h-[630px] w-[342px] shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[#020202]">
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
