import { Row } from "@/components/case/Row";
import { useLang } from "@/lib/i18n";

export function CaseUxart() {
  const { lang } = useLang();
  const ru = lang === "ru";
  return (
    <div className="uxart-page min-h-dvh w-full bg-[var(--c-page)] text-[color:var(--c-text)]">
      <div className="mx-auto w-full max-w-[1280px] px-5 pt-16 pb-24 md:px-6 md:pt-24 md:pb-32">
        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 1. Обзор                                                          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Обзор" : "Overview"}</Eyebrow>
                <p className="mt-4 text-[32px] md:text-[48px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-text)]">
                  {ru
                    ? "Vibe-coded прототипы: от провала до нового стандарта студии."
                    : "Vibe-coded prototypes: from a flop to the studio's new standard."}
                </p>
              </>
            }
          >
            <ul className="flex flex-wrap items-start gap-2">
              {(ru
                ? ["AI · процессы", "Дизайн-студия", "2025–2026"]
                : ["AI · process", "Design studio", "2025–2026"]
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
        {/* 2. Hero                                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 rounded-[24px] bg-[var(--c-accent)] px-4 py-6 md:px-8 md:py-12">
          <Shot
            src="/uxart/hero-1.webp"
            alt={
              ru
                ? "Прототип Приморских бань — зал с фонтаном и фирменными слонами"
                : "Primorskiye Bani prototype — a hall with a fountain and the brand's signature elephants"
            }
            aspect="1400 / 708"
            className="w-full md:flex-1"
          />
          <Shot
            src="/uxart/hero-2.webp"
            alt={
              ru
                ? "Прототип Приморских бань — главный экран лендинга"
                : "Primorskiye Bani prototype — the landing page hero"
            }
            aspect="1400 / 708"
            className="w-full md:flex-1"
          />
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 3. Контекст: студия, моя роль, стек                               */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[30px] md:text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-text)]">
                {ru
                  ? "Студия, в которую пришёл, и зачем."
                  : "The studio I joined, and why."}
              </h2>
            }
          >
            <div className="space-y-6 text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              <p>
                {ru
                  ? "UXART — топ-8 дизайн-студия РФ, специализация — сложные интерфейсы: дашборды, админки, B2B-системы. CEO — Артём Конаков. Меня позвали с навыками AI-инструментов и идеей: найти, где они приживутся в процессах студии и как внедрять успешно."
                  : "UXART is a top-8 design studio in Russia, specializing in complex interfaces: dashboards, admin panels, B2B systems. CEO — Artyom Konakov. They brought me in for my AI-tooling skills and a single mission: find where those tools take root in the studio's process and how to roll them out for real."}
              </p>
              <p className="text-[color:var(--c-text-2)]">
                {ru
                  ? "Пробовали в разных местах. Этот кейс — про пресейлы, одно из направлений, где на тот момент добились хорошего результата."
                  : "We tried them in a few places. This case is about presales — one track where we got to a genuinely good outcome."}
              </p>
            </div>
          </Row>
        </section>

        <div className="h-12 md:h-20" />

        <section>
          <div className="flex w-full flex-col md:flex-row items-stretch gap-4 md:gap-5">
            <ConstraintCard
              label="Claude (Artifacts)"
              body={
                ru
                  ? "Vibe-coded интерактивные прототипы, готовые к передаче в разработку."
                  : "Vibe-coded interactive prototypes, ready to hand off to engineering."
              }
            />
            <ConstraintCard
              label="GPT Image"
              body={
                ru
                  ? "UI-иллюстрации и визуал под лендинги."
                  : "UI illustrations and visuals for landing pages."
              }
            />
            <ConstraintCard
              label="Gemini 2.5 Flash Image"
              body={
                ru
                  ? "Nano Banana — основной инструмент для изображений до выхода GPT Image."
                  : "Nano Banana — our go-to for imagery until GPT Image shipped."
              }
            />
            <ConstraintCard
              label="GitHub Pages"
              body={
                ru
                  ? "Шеринг прототипа клиенту по ссылке — открыл с телефона, потыкал, оставил фидбек."
                  : "Sharing the prototype with the client by link — open it on your phone, poke around, leave feedback."
              }
            />
          </div>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 4. Пресейл 1                                                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Пресейл 1" : "Presale 1"}</Eyebrow>
                <h2 className="mt-4 text-[30px] md:text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-text)]">
                  {ru
                    ? "HR-платформа для Всеинструменты.ru — провал."
                    : "HR platform for Vseinstrumenty.ru — a flop."}
                </h2>
              </>
            }
          >
            <div className="space-y-6 text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              <p>
                {ru
                  ? "Внутренняя HR-платформа: найм одновременно на IT и рядовые позиции, отдельные лендинги под направления плюс общий. Дизайн-решения типовые — вызов был не дизайнерский, а процессный: собрать полноценный интерактивный пресейл за 3,5 дня в новой для студии методологии."
                  : "An internal HR platform: hiring for IT and frontline roles at once, separate landing pages per track plus a shared one. The design decisions were standard — the challenge wasn't design, it was process: ship a full interactive presale in 3.5 days using a methodology brand-new to the studio."}
              </p>
              <p className="text-[color:var(--c-text-2)]">
                {ru
                  ? "Прототип vibe-coded в Claude Artifacts, иллюстрации — Gemini 2.5 Flash Image. Технически собран чисто: кастомные иконки, выверенная сетка, рабочая логика, готов к интеграции с БД."
                  : "The prototype was vibe-coded in Claude Artifacts, illustrations by Gemini 2.5 Flash Image. Technically it was clean: custom icons, a tight grid, working logic, ready to wire up to a database."}
              </p>
            </div>
          </Row>
        </section>

        <div className="h-12 md:h-20" />

        <section className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 rounded-[24px] bg-[var(--c-invert-deep)] px-4 py-6 md:px-16 md:py-8">
          <Shot
            src="/uxart/presale1-1.webp"
            alt={
              ru
                ? "HR-платформа Всеинструменты.ру — универсальный лендинг"
                : "Vseinstrumenty.ru HR platform — the general landing page"
            }
            aspect="1656 / 4096"
            className="w-full md:flex-1"
          />
          <Shot
            src="/uxart/presale1-2.webp"
            alt={
              ru
                ? "HR-платформа Всеинструменты.ру — список и поиск вакансий"
                : "Vseinstrumenty.ru HR platform — job listing and search"
            }
            aspect="2460 / 4096"
            className="w-full md:flex-1"
          />
          <Shot
            src="/uxart/presale1-3.webp"
            alt={
              ru
                ? "HR-платформа Всеинструменты.ру — карточка вакансии"
                : "Vseinstrumenty.ru HR platform — a job card"
            }
            aspect="1957 / 4096"
            className="w-full md:flex-1"
          />
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 5. Три развилки                                                   */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <Eyebrow>{ru ? "Где сломалось" : "Where it broke"}</Eyebrow>
            <h2 className="mt-4 text-[30px] md:text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-text)]">
              {ru ? "На трёх развилках" : "At three forks"}
            </h2>
          </Narrow>
          <div className="mt-12 flex w-full flex-col md:flex-row items-stretch gap-4 md:gap-5">
            <BreakdownCard
              letter="1"
              title={
                ru
                  ? "Арт-дирекшн не знал, как ревьюить AI-результат"
                  : "Art direction didn't know how to review an AI result"
              }
              note={
                ru
                  ? "AI-генерация улучшает прототип нелинейно — сразу весь, а не блок за блоком. У арт-дира до самого конца сохранялось ощущение «недоделано», хотя результат уже был отличный. Сомнение жило параллельно с фактическим качеством."
                  : "AI generation improves a prototype non-linearly — the whole thing at once, not block by block. Right up to the end the art director kept feeling it was \"unfinished,\" even though the result was already excellent. The doubt ran in parallel with the actual quality."
              }
            />
            <BreakdownCard
              letter="2"
              title={
                ru
                  ? "CEO видел замедление, а не ускорение"
                  : "The CEO saw a slowdown, not a speedup"
              }
              note={
                ru
                  ? "3 дня vibe-кодили, потом ещё неделю выправляли в Figma. Нормальных инструментов переноса тогда не было — нативные ломают вёрстку. Не сэкономили время, а растянули его."
                  : "Three days of vibe-coding, then another week straightening it out in Figma. There were no decent handoff tools back then — the native ones broke the layout. We didn't save time, we stretched it."
              }
            />
            <BreakdownCard
              letter="3"
              title={
                ru
                  ? "Разработка собрала свой за 1 день"
                  : "Engineering built their own in 1 day"
              }
              note={
                ru
                  ? "Ни код, ни Figma-макет в работу не взяли. Собрали vibe-coded замен «за один промт»: эмодзи вместо кастомных иконок, поплывшие отступы, кусков функционала нет. Клиенту показали именно это."
                  : "Neither the code nor the Figma mockup was used. They vibe-coded a replacement \"in one prompt\": emoji instead of custom icons, spacing all over the place, chunks of functionality missing. That's exactly what got shown to the client."
              }
            />
          </div>
          <div className="mt-10 rounded-[20px] bg-[var(--c-invert)] px-6 py-8 md:px-8 md:py-10">
            <p className="text-[20px] md:text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] text-[color:var(--c-invert-text)]">
              {ru
                ? "Поломанный макет был в Figma. Идеально собранный — в коде."
                : "The broken mockup was in Figma. The perfect one was in code."}
            </p>
            <p className="mt-4 text-[16px] leading-[1.6] text-[color:var(--c-invert-text-2)]">
              {ru
                ? "Этот парадокс и стал ядром провала: команда смотрела в Figma и не видела результата, которого мы добились."
                : "That paradox was the core of the failure: the team looked at Figma and never saw the result we'd actually achieved."}
            </p>
          </div>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 6. Реакция клиента + решение в моменте                            */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row heading={<Eyebrow>{ru ? "Реакция клиента" : "Client reaction"}</Eyebrow>}>
            <p className="text-[24px] md:text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-[color:var(--c-text)]">
              {ru
                ? "«Презентационное видео — неплохое. Всё остальное — никакой ценности для бизнеса нести не может»."
                : "“The pitch video is decent. Everything else can't carry any value for the business.”"}
            </p>
            <p className="mt-6 text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Пресейл проиграли. В презентации я мог показать свой собранный код и проигнорированные Figma-блоки — переложить ответственность на разработку. Решил не делать: это превратило бы ретро в «разбор виноватых», а не системный анализ. Принял удар, через 1,5 дня сел с командой на обучение."
                : "We lost the presale. In the meeting I could have shown my own finished code and the ignored Figma blocks — pinning it on engineering. I chose not to: that would have turned the retro into a hunt for who's to blame instead of a systemic analysis. I took the hit and, a day and a half later, sat down with the team to run training."}
            </p>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 7. Ретро                                                          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[30px] md:text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-text)]">
                {ru ? "Ретро и сдвиг подхода" : "The retro and a shift in approach"}
              </h2>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru
                ? "Проблема была не в технологии, а в том, что новый артефакт попал в команду без точек стыковки. Разработчики не знали, что делать с архивом; арт-дир не понимал, как ревьюить не-Figma макет; CEO видел растяжение процесса. Я недооценил, насколько чужой этот формат для существующего процесса."
                : "The problem wasn't the technology — it was that a new artifact landed on the team with no points of connection. The developers didn't know what to do with the archive; the art director couldn't tell how to review a non-Figma mockup; the CEO saw the process stretch out. I underestimated how foreign this format was to the existing workflow."}
            </p>
          </Row>
          <div className="mt-10 rounded-[20px] bg-[var(--c-surface)] px-6 py-8 md:px-8 md:py-10">
            <p className="text-[22px] md:text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-[color:var(--c-text)]">
              {ru
                ? "Внедрение нового инструмента — это на 30% про инструмент и на 70% про коммуникацию с командой."
                : "Rolling out a new tool is 30% about the tool and 70% about communicating with the team."}
            </p>
          </div>
        </section>

        <div className="h-12 md:h-20" />

        <section>
          <Row
            heading={
              <h3 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] tracking-[-0.01em] text-[color:var(--c-text)]">
                {ru ? "Что сделал по обучению" : "What I did for the training"}
              </h3>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru
                ? "Собрал 1,5-часовой звонок с командой — выжимка по работе с Claude Artifacts и Nano Banana / GPT Image:"
                : "I ran a 1.5-hour call with the team — a distilled walkthrough of working with Claude Artifacts and Nano Banana / GPT Image:"}
            </p>
            <div className="mt-8">
              <Signal
                label={ru ? "Что разобрали" : "What we covered"}
                items={
                  ru
                    ? [
                        "Что это за инструменты и для чего каждый.",
                        "Как ставить задачу — где AI силён, где слаб.",
                        "Как ревьюить результат — что норма, а что доделка.",
                        "Как передавать в разработку — формат архива, сопроводиловка.",
                        "Где границы — что точно не делаем через AI.",
                      ]
                    : [
                        "What these tools are and what each one is for.",
                        "How to frame the task — where AI is strong, where it's weak.",
                        "How to review the result — what's normal and what needs finishing.",
                        "How to hand off to engineering — the archive format and the accompanying notes.",
                        "Where the limits are — what we definitely don't do through AI.",
                      ]
                }
              />
            </div>
            <p className="mt-10 text-[18px] leading-[1.6] text-[color:var(--c-text-2)]">
              {ru
                ? "Звонок записали. Ребята пересматривали запись и повторяли под свои задачи — никаких многонедельных тренингов. Знание начало размножаться без меня."
                : "We recorded the call. People rewatched it and reapplied it to their own tasks — no multi-week training program. The knowledge started multiplying without me."}
            </p>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 8. Пресейл 2                                                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <>
                <Eyebrow>{ru ? "Пресейл 2" : "Presale 2"}</Eyebrow>
                <h2 className="mt-4 text-[30px] md:text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-text)]">
                  {ru
                    ? "Приморские бани — пересборка процесса."
                    : "Primorskiye Bani — rebuilding the process."}
                </h2>
              </>
            }
          >
            <div className="space-y-6 text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              <p>
                {ru
                  ? "Лендинг бани с пред-зашитой странностью: по главной плавают нарисованные розовые слоны — брендинговая идея клиента. Студии до нас предлагали слонов убрать и сделать «строгий бренд для серьёзного бизнеса». Мы пошли в обратную сторону."
                  : "A bathhouse landing page with a quirk baked in from the start: illustrated pink elephants drift across the homepage — the client's own branding idea. The studios before us had proposed dropping the elephants and building a \"serious brand for a serious business.\" We went the other way."}
              </p>
            </div>
          </Row>
        </section>

        <div className="h-12 md:h-20" />

        <section className="flex flex-col gap-6 rounded-[24px] bg-[var(--c-surface-2)] p-5 md:p-8">
          <Shot
            src="/uxart/presale2-1.webp"
            alt={
              ru
                ? "Приморские бани — экран с ценами и тарифами"
                : "Primorskiye Bani — the pricing and plans screen"
            }
            aspect="2200 / 828"
            className="w-full"
          />
          <Shot
            src="/uxart/presale2-2.webp"
            alt={
              ru
                ? "Приморские бани — блок «Услуги комплекса»"
                : "Primorskiye Bani — the “Complex services” section"
            }
            aspect="2200 / 785"
            className="w-full"
          />
        </section>

        <div className="h-12 md:h-20" />

        <section>
          <Row
            heading={
              <h3 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] tracking-[-0.01em] text-[color:var(--c-text)]">
                {ru ? "Слоны как фича, а не шум." : "Elephants as a feature, not noise."}
              </h3>
            }
          >
            <p className="text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru
                ? "Оставили слонов и сделали их рабочим элементом интерфейса, а не декоративным фоном:"
                : "We kept the elephants and turned them into a working part of the interface, not a decorative backdrop:"}
            </p>
            <div className="mt-8">
              <Signal
                label={ru ? "Что делают слоны" : "What the elephants do"}
                items={
                  ru
                    ? [
                        "Ходят по карте локаций, указывая, где какое место — вместо статичных пинов.",
                        "Летают в парилку и обратно — анимация на переходах между секциями.",
                        "Реагируют на скролл и наведение — добавляют живость, не отвлекая от контента.",
                      ]
                    : [
                        "They walk across the location map, pointing out what's where — instead of static pins.",
                        "They fly to the steam room and back — an animation on the transitions between sections.",
                        "They react to scroll and hover — adding life without pulling focus from the content.",
                      ]
                }
              />
            </div>
            <p className="mt-10 text-[20px] font-medium leading-[1.4] tracking-[-0.005em] text-[color:var(--c-text)]">
              {ru
                ? "Странность бренда стала навигационной системой и эмоциональным якорем."
                : "The brand's quirk became a navigation system and an emotional anchor."}
            </p>
          </Row>
        </section>

        <div className="h-12 md:h-20" />

        <section className="rounded-[24px] bg-[var(--c-surface-2)] p-5 md:p-8">
          <Shot
            src="/uxart/embed.webp"
            alt={
              ru
                ? "Интерактивный прототип Приморских бань — карта локаций (план комплекса)"
                : "Interactive Primorskiye Bani prototype — the location map (complex layout)"
            }
            aspect="2200 / 1095"
            className="w-full"
          />
        </section>

        <div className="h-20 md:h-40" />

        <section>
          <Row
            heading={
              <h3 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] tracking-[-0.01em] text-[color:var(--c-text)]">
                {ru ? "Что поменяли в процессе" : "What we changed in the process"}
              </h3>
            }
          >
            <div>
              <Signal
                label={ru ? "Четыре сдвига" : "Four shifts"}
                items={
                  ru
                    ? [
                        "Две версии прототипа вместо одной — клиент выбирает направление, а не принимает первое показанное.",
                        "Шеринг через GitHub Pages: клиент открывал ссылку с телефона, тыкал слонов, давал фидбек по тому, что чувствуется.",
                        "Точки передачи дизайн → разработка прописаны до старта проекта — то, что провалили на пресейле 1.",
                        "Vibe-coded интерактив в Claude Artifacts, иллюстрации — GPT Image.",
                      ]
                    : [
                        "Two prototype versions instead of one — the client picks a direction rather than accepting the first thing shown.",
                        "Sharing via GitHub Pages: the client opened the link on their phone, tapped the elephants, and gave feedback on how it felt.",
                        "Design → engineering handoff points written down before the project starts — the exact thing we botched in presale 1.",
                        "Vibe-coded interactivity in Claude Artifacts, illustrations by GPT Image.",
                      ]
                }
              />
            </div>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        <section>
          <Row heading={<Eyebrow>{ru ? "Реакция клиента" : "Client reaction"}</Eyebrow>}>
            <p className="text-[24px] md:text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-[color:var(--c-text)]">
              {ru
                ? "«Попали и анимашками, и оформлением в самое сердечко. Удобно работать: открыл ссылку, увидел примерный результат»."
                : "“The animations and the design hit us right in the heart. Easy to work with: open the link, see roughly what you'll get.”"}
            </p>
            <p className="mt-6 text-[18px] leading-[1.6] text-[color:var(--c-text)]">
              {ru ? "Пресейл забрали." : "We won the presale."}
            </p>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 9. Что изменилось в студии                                        */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[30px] md:text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-text)]">
                {ru ? "Что изменилось в студии" : "What changed at the studio"}
              </h2>
            }
          >
            <div>
              <Signal
                label={ru ? "Сигналы" : "Signals"}
                items={
                  ru
                    ? [
                        "Vibe-coded интерактивные прототипы → стандарт пресейл-процесса за полтора месяца.",
                        "80% команды используют AI на пресейлах — вшито в рабочий процесс, а не «попробовали разок».",
                        "Запись 1,5-часового звонка работает как онбординг для новых дизайнеров — без меня в роли единственного носителя.",
                        "GitHub Pages-шеринг — дефолтный формат демонстрации пресейл-прототипов вместо Figma-ссылок.",
                        "AI-пресейлы прорабатываются как отдельная услуга в прайсе.",
                      ]
                    : [
                        "Vibe-coded interactive prototypes → the presale-process standard within six weeks.",
                        "80% of the team use AI in presales — baked into the workflow, not a one-time experiment.",
                        "The 1.5-hour call recording works as onboarding for new designers — without me as the sole knowledge holder.",
                        "GitHub Pages sharing — the default way to demo presale prototypes instead of Figma links.",
                        "AI presales are being developed into a standalone line item in the price list.",
                      ]
                }
              />
            </div>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 10. Lessons learned                                               */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[30px] md:text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-text)]">
              Lessons learned
            </h2>
          </Narrow>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 md:gap-y-12">
            <Lesson
              title={
                ru
                  ? "Внедрение нового инструмента — это change management, а не tutorial."
                  : "Rolling out a new tool is change management, not a tutorial."
              }
              body={
                ru
                  ? "Технически готовый артефакт без точек стыковки с процессом — это саботаж, даже если он лучше старого."
                  : "A technically finished artifact with no points of connection to the process is sabotage — even if it's better than what came before."
              }
            />
            <Lesson
              title={
                ru
                  ? "Команде нужно дать оптику ревью AI-результата."
                  : "The team needs a lens for reviewing an AI result."
              }
              body={
                ru
                  ? "Нейросеть генерит нелинейно — без обучения люди видят «недоделанное», даже когда смотрят на отличное."
                  : "A neural net generates non-linearly — without training, people see \"unfinished\" even when they're looking at something excellent."
              }
            />
            <Lesson
              title={
                ru
                  ? "Инструменты переноса важнее инструментов генерации."
                  : "Handoff tools matter more than generation tools."
              }
              body={
                ru
                  ? "Упёрлись не в Claude, а в отсутствие моста vibe-code → Figma. Проектные риски оцениваем по полному пайплайну, а не только по «инструментам на старте»."
                  : "We didn't hit a wall with Claude — we hit the missing bridge from vibe-code to Figma. Assess project risk across the whole pipeline, not just the \"tools you start with.\""
              }
            />
            <Lesson
              title={
                ru
                  ? "В моменте провала — не перекладывай ответственность."
                  : "In the moment of failure, don't shift the blame."
              }
              body={
                ru
                  ? "Технически был материал свалить на разработку. Не сделал — это открыло реальное ретро, а не разбор виноватых. Без этой развилки второй пресейл бы не выстрелил."
                  : "I had the material to pin it on engineering. I didn't — and that opened up a real retro instead of a blame hunt. Without that fork, the second presale wouldn't have landed."
              }
            />
          </div>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 12. Команда                                                       */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[30px] md:text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-text)]">
                {ru ? "Команда" : "Team"}
              </h2>
            }
          >
            <div className="mt-10 space-y-8">
              <Credit
                role={ru ? "CEO студии" : "Studio CEO"}
                name={ru ? "Артём Конаков" : "Artyom Konakov"}
                body={
                  ru
                    ? "Заказчик внедрения, держал рамку «AI должен ускорять, а не имитировать работу»."
                    : "The sponsor of the rollout, who held the line: \"AI should speed up the work, not imitate it.\""
                }
              />
              <Credit
                role={ru ? "Арт-дирекшн" : "Art direction"}
                name="—"
                body={
                  ru
                    ? "Ревьюер дизайна. После обучения — соавтор стандарта ревью AI-результата."
                    : "Design reviewer. After the training — co-author of the standard for reviewing AI results."
                }
              />
              <Credit
                role={ru ? "Команда разработки" : "Engineering team"}
                name="—"
                body={
                  ru
                    ? "Перенимали vibe-coded архивы. После ретро — соавторы точек передачи дизайн → разработка."
                    : "Received the vibe-coded archives. After the retro — co-authors of the design → engineering handoff points."
                }
              />
              <Credit
                role={
                  ru
                    ? "Продуктовый дизайнер с фокусом на AI"
                    : "Product designer with an AI focus"
                }
                name={ru ? "Я" : "Me"}
                body={
                  ru
                    ? "Внедрение стека, пресейл-прототипы, ретро после провала, обучение команды, пересборка процесса."
                    : "Rolling out the stack, presale prototypes, the post-failure retro, training the team, rebuilding the process."
                }
              />
            </div>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 13. Карточка проекта                                             */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Row
            heading={
              <h2 className="text-[30px] md:text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-text)]">
                {ru ? "Карточка проекта" : "Project card"}
              </h2>
            }
          >
            <div className="mt-10 flex flex-col">
              <Fact
                label={ru ? "Роль" : "Role"}
                value={
                  ru
                    ? "Продуктовый дизайнер с фокусом на AI · внедрение стека и пересборка пресейл-процесса · ~1,5 месяца"
                    : "Product designer with an AI focus · rolling out the stack and rebuilding the presale process · ~1.5 months"
                }
              />
              <Fact
                label={ru ? "Проблема" : "Problem"}
                value={
                  ru
                    ? "Первый пресейл с vibe-coded прототипом провалили — артефакт попал в команду без точек стыковки."
                    : "We lost the first presale built on a vibe-coded prototype — the artifact reached the team with no points of connection."
                }
              />
              <Fact
                label={ru ? "Решение" : "Solution"}
                value={
                  ru
                    ? "1,5-часовая выжимка по AI с записью. Перестройка процесса: две версии прототипа, GitHub Pages-шеринг, явные точки передачи в разработку."
                    : "A recorded 1.5-hour distilled session on AI. A process overhaul: two prototype versions, GitHub Pages sharing, explicit handoff points to engineering."
                }
              />
              <Fact
                label={ru ? "Результат" : "Result"}
                value={
                  ru
                    ? "Пресейл Приморских забрали. 80% команды используют AI на пресейлах. Vibe-coded прототипы — стандарт студии."
                    : "We won the Primorskiye presale. 80% of the team use AI in presales. Vibe-coded prototypes are now the studio standard."
                }
              />
            </div>
          </Row>
        </section>

        <div className="h-20 md:h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 14. CTA                                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="rounded-[24px] bg-[var(--c-invert)] px-6 py-12 md:px-12 md:py-20">
          <div className="mx-auto max-w-[680px]">
            <p className="text-[30px] md:text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--c-invert-text)]">
              {ru
                ? "Готов обсудить, как сделать что-то похожее у вас"
                : "Happy to talk through how to do something like this for you"}
            </p>
            <div className="mt-10 flex flex-wrap items-start gap-8 md:gap-12 whitespace-nowrap">
              <a
                href="mailto:timi@example.ru"
                className="flex flex-col items-start gap-2"
              >
                <span className="text-[13px] font-semibold leading-none text-[color:var(--c-invert-text-2)]">
                  {ru ? "Почта" : "Email"}
                </span>
                <span className="text-[22px] font-semibold leading-[1.2] text-[color:var(--c-invert-text)]">
                  timi@example.ru
                </span>
              </a>
              <a
                href="https://t.me/timi"
                className="flex flex-col items-start gap-2"
              >
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-6 md:gap-10 border-t border-[color:var(--c-border)] py-5 first:border-t-0">
      <p className="w-[120px] shrink-0 text-[14px] font-semibold leading-[1.5] text-[color:var(--c-text-3)]">
        {label}
      </p>
      <p className="flex-1 text-[18px] leading-[1.6] text-[color:var(--c-text)]">
        {value}
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

function BreakdownCard({
  letter,
  title,
  note,
}: {
  letter: string;
  title: string;
  note: string;
}) {
  const ru = useLang().lang === "ru";
  return (
    <div className="flex flex-1 min-w-0 flex-col items-start gap-5 self-stretch overflow-hidden rounded-[16px] bg-[var(--c-surface)] p-6">
      <p className="text-[13px] font-semibold leading-none text-[color:var(--c-text-3)]">
        {ru ? "Развилка" : "Fork"} {letter}
      </p>
      <p className="w-full text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-[color:var(--c-text)]">
        {title}
      </p>
      <p className="w-full text-[14px] font-normal leading-[1.55] text-[color:var(--c-text-2)]">
        {note}
      </p>
    </div>
  );
}

function Shot({
  src,
  alt,
  aspect,
  className = "",
}: {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[12px] ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
