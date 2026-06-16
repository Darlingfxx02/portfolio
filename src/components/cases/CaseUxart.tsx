export function CaseUxart() {
  return (
    <div className="uxart-page min-h-dvh w-full bg-white text-[#263238]">
      <div className="mx-auto w-full max-w-[1280px] px-6 pt-24 pb-32">
        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 1. Обзор                                                          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <Eyebrow>Обзор</Eyebrow>
            <p className="mt-10 text-[48px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#263238]">
              Vibe-coded прототипы: от провала до нового стандарта студии.
            </p>
            <ul className="mt-10 flex flex-wrap items-start gap-2">
              {["AI · процессы", "Дизайн-студия", "2025–2026"].map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-full bg-[#eceff1] px-3.5 py-[7px] text-[13px] font-semibold leading-none text-[#263238]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Narrow>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 2. Hero                                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="flex items-center justify-center gap-8 rounded-[24px] bg-[#45c1ff] px-8 py-12">
          <Shot
            src="/uxart/hero-1.png"
            alt="Прототип Приморских бань — интерьер парилки со слонами"
            aspect="1713 / 862"
            className="flex-1"
          />
          <Shot
            src="/uxart/hero-2.png"
            alt="Прототип Приморских бань — главный экран лендинга"
            aspect="1713 / 862"
            className="flex-1"
          />
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 3. Контекст: студия, моя роль, стек                               */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#263238]">
              Студия, в которую пришёл, и зачем.
            </h2>
            <div className="mt-10 space-y-6 text-[18px] leading-[1.6] text-[#263238]">
              <p>
                UXART — топ-8 дизайн-студия РФ, специализация — сложные
                интерфейсы: дашборды, админки, B2B-системы. CEO — Артём
                Конаков. Меня позвали с навыками AI-инструментов и идеей:
                найти, где они приживутся в процессах студии и как внедрять
                успешно.
              </p>
              <p className="text-[#546e7a]">
                Пробовали в разных местах. Этот кейс — про пресейлы, одно
                из направлений, где на тот момент добились хорошего
                результата.
              </p>
            </div>
          </Narrow>
        </section>

        <div className="h-20" />

        <section>
          <div className="flex w-full items-stretch gap-5">
            <ConstraintCard
              label="Claude (Artifacts)"
              body="Vibe-coded интерактивные прототипы, готовые к передаче в разработку."
            />
            <ConstraintCard
              label="GPT Image"
              body="UI-иллюстрации и визуал под лендинги."
            />
            <ConstraintCard
              label="Gemini 2.5 Flash Image"
              body="Nano Banana — основной инструмент для изображений до выхода GPT Image."
            />
            <ConstraintCard
              label="GitHub Pages"
              body="Шеринг прототипа клиенту по ссылке — открыл с телефона, потыкал, оставил фидбек."
            />
          </div>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 4. Пресейл 1                                                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <Eyebrow>Пресейл 1</Eyebrow>
            <h2 className="mt-4 text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#263238]">
              HR-платформа для Всеинструменты.ru — провал.
            </h2>
            <div className="mt-10 space-y-6 text-[18px] leading-[1.6] text-[#263238]">
              <p>
                Внутренняя HR-платформа: найм одновременно на IT и рядовые
                позиции, отдельные лендинги под направления плюс общий.
                Дизайн-решения типовые — вызов был не дизайнерский, а
                процессный: собрать полноценный интерактивный пресейл за
                3,5 дня в новой для студии методологии.
              </p>
              <p className="text-[#546e7a]">
                Прототип vibe-coded в Claude Artifacts, иллюстрации — Gemini
                2.5 Flash Image. Технически собран чисто: кастомные иконки,
                выверенная сетка, рабочая логика, готов к интеграции с БД.
              </p>
            </div>
          </Narrow>
        </section>

        <div className="h-20" />

        <section className="flex items-center justify-center gap-8 rounded-[24px] bg-[#020202] px-16 py-8">
          <Shot
            src="/uxart/presale1-1.png"
            alt="HR-платформа Всеинструменты.ру — универсальный лендинг"
            aspect="1656 / 4096"
            className="flex-1"
          />
          <Shot
            src="/uxart/presale1-2.png"
            alt="HR-платформа Всеинструменты.ру — список и поиск вакансий"
            aspect="2460 / 4096"
            className="flex-1"
          />
          <Shot
            src="/uxart/presale1-3.png"
            alt="HR-платформа Всеинструменты.ру — карточка вакансии"
            aspect="1957 / 4096"
            className="flex-1"
          />
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 5. Три развилки                                                   */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <Eyebrow>Где сломалось</Eyebrow>
            <h2 className="mt-4 text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#263238]">
              На трёх развилках
            </h2>
          </Narrow>
          <div className="mt-12 flex w-full items-stretch gap-5">
            <BreakdownCard
              letter="1"
              title="Арт-дирекшн не знал, как ревьюить AI-результат"
              note="AI-генерация улучшает прототип нелинейно — сразу весь, а не блок за блоком. У арт-дира до самого конца сохранялось ощущение «недоделано», хотя результат уже был отличный. Сомнение жило параллельно с фактическим качеством."
            />
            <BreakdownCard
              letter="2"
              title="CEO видел замедление, а не ускорение"
              note="3 дня vibe-кодили, потом ещё неделю выправляли в Figma. Нормальных инструментов переноса тогда не было — нативные ломают вёрстку. Не сэкономили время, а растянули его."
            />
            <BreakdownCard
              letter="3"
              title="Разработка собрала свой за 1 день"
              note="Ни код, ни Figma-макет в работу не взяли. Собрали vibe-coded замен «за один промт»: эмодзи вместо кастомных иконок, поплывшие отступы, кусков функционала нет. Клиенту показали именно это."
            />
          </div>
          <div className="mt-10 rounded-[20px] bg-[#222] px-8 py-10">
            <p className="text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] text-white">
              Поломанный макет был в Figma. Идеально собранный — в коде.
            </p>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#d9e0eb]">
              Этот парадокс и стал ядром провала: команда смотрела в Figma и
              не видела результата, которого мы добились.
            </p>
          </div>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 6. Реакция клиента + решение в моменте                            */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <Eyebrow>Реакция клиента</Eyebrow>
            <p className="mt-8 text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#263238]">
              «Презентационное видео — неплохое. Всё остальное — никакой
              ценности для бизнеса нести не может».
            </p>
            <p className="mt-6 text-[18px] leading-[1.6] text-[#546e7a]">
              Пресейл проиграли. В презентации я мог показать свой собранный
              код и проигнорированные Figma-блоки — переложить ответственность
              на разработку. Решил не делать: это превратило бы ретро в
              «разбор виноватых», а не системный анализ. Принял удар, через
              1,5 дня сел с командой на обучение.
            </p>
          </Narrow>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 7. Ретро                                                          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#263238]">
              Ретро и сдвиг подхода
            </h2>
            <p className="mt-10 text-[18px] leading-[1.6] text-[#263238]">
              Проблема была не в технологии, а в том, что новый артефакт попал
              в команду без точек стыковки. Разработчики не знали, что делать
              с архивом; арт-дир не понимал, как ревьюить не-Figma макет;
              CEO видел растяжение процесса. Я недооценил, насколько чужой
              этот формат для существующего процесса.
            </p>
          </Narrow>
          <div className="mt-10 rounded-[20px] bg-[#f3f3f3] px-8 py-10">
            <p className="text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#263238]">
              Внедрение нового инструмента — это на 30% про инструмент и на
              70% про коммуникацию с командой.
            </p>
          </div>
        </section>

        <div className="h-20" />

        <section>
          <Narrow>
            <h3 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.01em] text-[#263238]">
              Что сделал по обучению
            </h3>
            <p className="mt-8 text-[18px] leading-[1.6] text-[#263238]">
              Собрал 1,5-часовой звонок с командой — выжимка по работе с
              Claude Artifacts и Nano Banana / GPT Image:
            </p>
            <div className="mt-8">
              <Signal
                label="Что разобрали"
                items={[
                  "Что это за инструменты и для чего каждый.",
                  "Как ставить задачу — где AI силён, где слаб.",
                  "Как ревьюить результат — что норма, а что доделка.",
                  "Как передавать в разработку — формат архива, сопроводиловка.",
                  "Где границы — что точно не делаем через AI.",
                ]}
              />
            </div>
            <p className="mt-10 text-[18px] leading-[1.6] text-[#546e7a]">
              Звонок записали. Ребята пересматривали запись и повторяли под
              свои задачи — никаких многонедельных тренингов. Знание начало
              размножаться без меня.
            </p>
          </Narrow>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 8. Пресейл 2                                                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <Eyebrow>Пресейл 2</Eyebrow>
            <h2 className="mt-4 text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#263238]">
              Приморские бани — пересборка процесса.
            </h2>
            <div className="mt-10 space-y-6 text-[18px] leading-[1.6] text-[#263238]">
              <p>
                Лендинг бани с пред-зашитой странностью: по главной плавают
                нарисованные розовые слоны — брендинговая идея клиента.
                Студии до нас предлагали слонов убрать и сделать «строгий
                бренд для серьёзного бизнеса». Мы пошли в обратную сторону.
              </p>
            </div>
          </Narrow>
        </section>

        <div className="h-20" />

        <section className="flex h-[620px] items-center justify-center gap-6 rounded-[24px] bg-[#eceff1] p-8">
          <Shot
            src="/uxart/presale2-1.png"
            alt="Приморские бани — экран цен"
            aspect="1168 / 630"
            className="flex-1"
          />
          <Shot
            src="/uxart/presale2-2.png"
            alt="Приморские бани — план этажа"
            aspect="1040 / 1712"
            className="h-full shrink-0"
          />
        </section>

        <div className="h-20" />

        <section>
          <Narrow>
            <h3 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.01em] text-[#263238]">
              Слоны как фича, а не шум.
            </h3>
            <p className="mt-8 text-[18px] leading-[1.6] text-[#263238]">
              Оставили слонов и сделали их рабочим элементом интерфейса, а не
              декоративным фоном:
            </p>
            <div className="mt-8">
              <Signal
                label="Что делают слоны"
                items={[
                  "Ходят по карте локаций, указывая, где какое место — вместо статичных пинов.",
                  "Летают в парилку и обратно — анимация на переходах между секциями.",
                  "Реагируют на скролл и наведение — добавляют живость, не отвлекая от контента.",
                ]}
              />
            </div>
            <p className="mt-10 text-[20px] font-medium leading-[1.4] tracking-[-0.005em] text-[#263238]">
              Странность бренда стала навигационной системой и эмоциональным
              якорем.
            </p>
          </Narrow>
        </section>

        <div className="h-20" />

        <section className="flex h-[620px] items-center justify-center rounded-[24px] bg-[#f7f9fb] px-8">
          <Shot
            src="/uxart/embed.png"
            alt="Интерактивный прототип Приморских бань — карта локаций"
            aspect="1165 / 583"
            className="flex-1"
          />
        </section>

        <div className="h-40" />

        <section>
          <Narrow>
            <h3 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.01em] text-[#263238]">
              Что поменяли в процессе
            </h3>
            <div className="mt-8">
              <Signal
                label="Четыре сдвига"
                items={[
                  "Две версии прототипа вместо одной — клиент выбирает направление, а не принимает первое показанное.",
                  "Шеринг через GitHub Pages: клиент открывал ссылку с телефона, тыкал слонов, давал фидбек по тому, что чувствуется.",
                  "Точки передачи дизайн → разработка прописаны до старта проекта — то, что провалили на пресейле 1.",
                  "Vibe-coded интерактив в Claude Artifacts, иллюстрации — GPT Image.",
                ]}
              />
            </div>
          </Narrow>
        </section>

        <div className="h-40" />

        <section>
          <Narrow>
            <Eyebrow>Реакция клиента</Eyebrow>
            <p className="mt-8 text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#263238]">
              «Попали и анимашками, и оформлением в самое сердечко. Удобно
              работать: открыл ссылку, увидел примерный результат».
            </p>
            <p className="mt-6 text-[18px] leading-[1.6] text-[#263238]">
              Пресейл забрали.
            </p>
          </Narrow>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 9. Что изменилось в студии                                        */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#263238]">
              Что изменилось в студии
            </h2>
            <div className="mt-10">
              <Signal
                label="Сигналы"
                items={[
                  "Vibe-coded интерактивные прототипы → стандарт пресейл-процесса за полтора месяца.",
                  "80% команды используют AI на пресейлах — вшито в рабочий процесс, а не «попробовали разок».",
                  "Запись 1,5-часового звонка работает как онбординг для новых дизайнеров — без меня в роли единственного носителя.",
                  "GitHub Pages-шеринг — дефолтный формат демонстрации пресейл-прототипов вместо Figma-ссылок.",
                  "AI-пресейлы прорабатываются как отдельная услуга в прайсе.",
                ]}
              />
            </div>
          </Narrow>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 10. Lessons learned                                               */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#263238]">
              Lessons learned
            </h2>
          </Narrow>
          <div className="mt-14 grid grid-cols-2 gap-x-10 gap-y-12">
            <Lesson
              title="Внедрение нового инструмента — это change management, а не tutorial."
              body="Технически готовый артефакт без точек стыковки с процессом — это саботаж, даже если он лучше старого."
            />
            <Lesson
              title="Команде нужно дать оптику ревью AI-результата."
              body="Нейросеть генерит нелинейно — без обучения люди видят «недоделанное», даже когда смотрят на отличное."
            />
            <Lesson
              title="Инструменты переноса важнее инструментов генерации."
              body="Упёрлись не в Claude, а в отсутствие моста vibe-code → Figma. Проектные риски оцениваем по полному пайплайну, а не только по «инструментам на старте»."
            />
            <Lesson
              title="В моменте провала — не перекладывай ответственность."
              body="Технически был материал свалить на разработку. Не сделал — это открыло реальное ретро, а не разбор виноватых. Без этой развилки второй пресейл бы не выстрелил."
            />
          </div>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 12. Команда                                                       */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#263238]">
              Команда
            </h2>
            <div className="mt-10 space-y-8">
              <Credit
                role="CEO студии"
                name="Артём Конаков"
                body="Заказчик внедрения, держал рамку «AI должен ускорять, а не имитировать работу»."
              />
              <Credit
                role="Арт-дирекшн"
                name="—"
                body="Ревьюер дизайна. После обучения — соавтор стандарта ревью AI-результата."
              />
              <Credit
                role="Команда разработки"
                name="—"
                body="Перенимали vibe-coded архивы. После ретро — соавторы точек передачи дизайн → разработка."
              />
              <Credit
                role="Продуктовый дизайнер с фокусом на AI"
                name="Я"
                body="Внедрение стека, пресейл-прототипы, ретро после провала, обучение команды, пересборка процесса."
              />
            </div>
          </Narrow>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 13. Карточка проекта                                             */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section>
          <Narrow>
            <h2 className="text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#263238]">
              Карточка проекта
            </h2>
            <div className="mt-10 flex flex-col">
              <Fact
                label="Роль"
                value="Продуктовый дизайнер с фокусом на AI · внедрение стека и пересборка пресейл-процесса · ~1,5 месяца"
              />
              <Fact
                label="Проблема"
                value="Первый пресейл с vibe-coded прототипом провалили — артефакт попал в команду без точек стыковки."
              />
              <Fact
                label="Решение"
                value="1,5-часовая выжимка по AI с записью. Перестройка процесса: две версии прототипа, GitHub Pages-шеринг, явные точки передачи в разработку."
              />
              <Fact
                label="Результат"
                value="Пресейл Приморских забрали. 80% команды используют AI на пресейлах. Vibe-coded прототипы — стандарт студии."
              />
            </div>
          </Narrow>
        </section>

        <div className="h-40" />

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* 14. CTA                                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="rounded-[24px] bg-[#263238] px-12 py-20">
          <div className="mx-auto max-w-[680px]">
            <p className="text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-white">
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-10 border-t border-[#eceff1] py-5 first:border-t-0">
      <p className="w-[120px] shrink-0 text-[14px] font-semibold leading-[1.5] text-[#90a4ae]">
        {label}
      </p>
      <p className="flex-1 text-[18px] leading-[1.6] text-[#263238]">
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

function BreakdownCard({
  letter,
  title,
  note,
}: {
  letter: string;
  title: string;
  note: string;
}) {
  return (
    <div className="flex flex-1 min-w-0 flex-col items-start gap-5 self-stretch overflow-hidden rounded-[16px] bg-[#f3f3f3] p-6">
      <p className="text-[13px] font-semibold leading-none text-[#90a4ae]">
        Развилка {letter}
      </p>
      <p className="w-full text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-[#263238]">
        {title}
      </p>
      <p className="w-full text-[14px] font-normal leading-[1.55] text-[#546e7a]">
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
