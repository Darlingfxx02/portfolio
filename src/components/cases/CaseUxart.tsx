import { useLang } from "@/lib/i18n";
import { CaseNarrative } from "./CaseNarrative";

export function CaseUxart() {
  const ru = useLang().lang === "ru";

  return (
    <CaseNarrative
      pageClassName="uxart-page"
      brand="Тимофей Ермолаев"
      title={
        ru
          ? "Как AI стал частью операционной модели дизайн-студии UXART."
          : "How AI became part of UXART’s operating model."
      }
      intro={
        ru
          ? "Меня пригласили не только как продуктового дизайнера, но и как специалиста по интеграции AI-инструментов. Я провёл аудит процессов студии, выбрал точки с измеримым эффектом и запустил три практики: генератор коммерческих предложений, AI-усиленные пресейлы и фреймворк автоматизации дизайна."
          : "I joined not only as a product designer but as an AI-integration specialist. I audited the studio workflow, selected opportunities with measurable value, and launched three practices: a proposal generator, AI-enhanced presales, and a design-automation framework."
      }
      tags={
        ru
          ? ["AI Transformation", "Design Operations", "Service Design", "2025"]
          : ["AI Transformation", "Design Operations", "Service Design", "2025"]
      }
      hero={
        <div className="case-narrative-hero--split">
          <img src="/uxart/hero-1.webp" alt={ru ? "AI-прототип для пресейла UXART" : "UXART AI presale prototype"} />
          <img src="/uxart/hero-2.webp" alt={ru ? "Интерактивный экран AI-прототипа" : "Interactive AI prototype screen"} />
        </div>
      }
      sections={
        ru
          ? [
              {
                code: "S",
                label: "Situation",
                body: "Генеративный AI уже использовался отдельными сотрудниками, но не был частью рабочего процесса компании. Эксперименты давали локальный эффект и зависели от личной инициативы: не было общих критериев выбора задач, проверки качества, передачи результата или измерения пользы.",
                support: [
                  {
                    title: "Пользователи изменений",
                    body: "Решения создавались не для абстрактной «дизайн-команды». Ими должны были пользоваться sales и account-менеджеры при подготовке КП, дизайнеры и арт-дирекция в пресейле, а руководители — для контроля качества и экономики процесса.",
                  },
                  {
                    title: "Главный риск",
                    body: "Внедрить модный инструмент вместо решения проблемы. Поэтому AI рассматривался как один из вариантов автоматизации, а не как заранее выбранный ответ.",
                  },
                ],
              },
              {
                code: "T",
                label: "Task",
                body: "Нужно было найти повторяемые операции с реальным бизнес-эффектом и превратить индивидуальные эксперименты в процессы, которыми может пользоваться вся студия.",
                bullets: [
                  "Разобрать путь проекта от лида и пресейла до дизайн-производства и delivery.",
                  "Оценить процессы по частоте, ручным затратам, ошибкам, стабильности контекста и потенциальной ценности.",
                  "Отделить задачи для скрипта или шаблона от задач, где LLM действительно нужен для работы с контекстом.",
                  "Запустить пилоты, встроить human review и зафиксировать правила масштабирования.",
                ],
              },
              {
                code: "A1",
                label: "Process audit",
                body: "Я разложил жизненный цикл проекта на lead, presale, commercial proposal, discovery, design и delivery. Для каждого этапа фиксировал объём ручной работы, повторяемость, цену ошибки, стабильность входных данных и ожидаемый эффект автоматизации.",
                support: [
                  {
                    title: "Почему выбрали эти сценарии",
                    body: "Подготовка КП имела стабильный шаблон, высокую повторяемость и низкую допустимость ошибок. Пресейл-прототипы требовали больше человеческого решения, но давали высокую ценность в стратегических лидах. Автогенерацию финального дизайна не приоритизировали: контекст был слишком нестабилен, а цена непроверенной ошибки — высокой.",
                  },
                  {
                    title: "Критерий AI vs обычная автоматизация",
                    body: "Там, где достаточно переносить числа, использовалась детерминированная логика. LLM подключался только к неструктурированному брифу, смысловой группировке и черновому тексту. Итоговые расчёты и документ всегда проходили человеческую проверку.",
                  },
                ],
              },
              {
                code: "A2",
                label: "Proposal generator",
                body: "Мы создали микросервис, который превращал клиентский бриф в коммерческое предложение по существующему Excel-шаблону. Сервис не придумывал финансовую модель: он структурировал входные данные, подготавливал оценку, заполнял обязательные поля и возвращал документ на ревью менеджеру.",
                bullets: [
                  "Вход: бриф, тип проекта, состав работ, сроки и ограничения.",
                  "Обработка: AI-разбор неструктурированного текста + детерминированные правила расчёта.",
                  "Выход: заполненный Excel-шаблон и версия для отправки клиенту.",
                  "Контроль: обязательный human review перед экспортом.",
                ],
                support: [
                  {
                    title: "Моя зона ответственности",
                    body: "Я описал пользовательский процесс, требования к входам и выходам, правила исключений, точки человеческой проверки и критерии готовности. Техническую реализацию собирали вместе с разработкой.",
                  },
                ],
                media: [
                  { src: "/uxart/embed.webp", alt: "Встроенный AI-инструмент в процессе UXART" },
                ],
              },
              {
                code: "A3",
                label: "AI-enhanced presales",
                body: "Для наиболее ценных лидов мы усилили стандартный пресейл интерактивным AI-assisted прототипом, собранным за 3–4 дня. Он шёл вместе с презентацией и коммерческим предложением — не заменял их, а давал клиенту возможность «потрогать» возможное направление до подписания договора.",
                support: [
                  {
                    title: "Зачем это было клиенту",
                    body: "Прототип делал разговор предметным, быстрее синхронизировал ожидания и показывал уровень вовлечённости студии. Реакция «вы уже так глубоко погрузились в нашу задачу» стала самостоятельным аргументом в пользу команды.",
                  },
                  {
                    title: "Как контролировали качество",
                    body: "Claude Artifacts и image-модели ускоряли сборку, GitHub Pages давал клиенту живую ссылку. До показа команда проверяла основной сценарий, бренд, контент, ограничения AI-результата и поведение на устройстве клиента.",
                  },
                ],
                media: [
                  { src: "/uxart/presale1-1.webp", alt: "Первый AI-усиленный пресейл UXART" },
                  { src: "/uxart/presale1-3.webp", alt: "Деталь интерактивного пресейл-прототипа" },
                  { src: "/uxart/presale2-1.webp", alt: "Второй AI-усиленный пресейл UXART" },
                  { src: "/uxart/presale2-2.webp", alt: "Интерактивная версия второго пресейла" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A4",
                label: "Design automation framework",
                body: "Чтобы практика не зависела от конкретного инструмента, я оформил собственный фреймворк: Discover → Evaluate → Prototype → Validate → Integrate → Scale. Он помогает команде начинать с узкого места процесса, выбирать подходящую технологию и масштабировать только проверенный сценарий.",
                bullets: [
                  "Discover — наблюдение и интервью с участниками процесса.",
                  "Evaluate — ценность, частота, ручное время, ошибки и стабильность контекста.",
                  "Prototype — самый короткий end-to-end пилот на реальных данных.",
                  "Validate — качество результата, время, ошибки и доверие пользователя.",
                  "Integrate — владельцы, human review, документация и handoff.",
                  "Scale — обучение, повторное использование и регулярный пересмотр метрик.",
                ],
              },
              {
                code: "A5",
                label: "Adoption",
                body: "Я провёл обучение команды и зафиксировал правила работы с AI-результатом: один source of truth, известные ограничения, ответственные за визуальный и интерактивный review, README для передачи и список того, что обязательно проверяет человек.",
                support: [
                  {
                    title: "Что оказалось сложнее технологии",
                    body: "Не собрать прототип, а встроить его в привычный маршрут команды. Без владельца, критериев ревью и понятной передачи даже сильный артефакт остаётся личным экспериментом.",
                  },
                ],
              },
              {
                code: "R",
                label: "Result",
                body: "AI перестал быть отдельным экспериментом и стал частью коммерческого и дизайн-процесса студии. Команда быстрее собирала повторяемые документы, усиливала стратегические пресейлы работающими прототипами и получила общий способ оценки новых автоматизаций.",
                metrics: [
                  { value: "−75%", label: "Подготовка КП", detail: "с 2–3 часов до 25–30 минут" },
                  { value: "14 → 4", label: "Дни на пресейл", detail: "для приоритетного интерактивного прототипа" },
                  { value: "+15%", label: "Конверсия лидов", detail: "оценка по стратегическим пресейлам" },
                  { value: "80%", label: "AI adoption", detail: "оценка доли дизайн-команды" },
                  { value: "−50%", label: "Рутинная документация", detail: "оценка времени на повторяемые материалы" },
                  { value: "60%+", label: "Рутина пресейла", detail: "доля автоматизированных повторяемых действий" },
                ],
                note: "Проценты показывают рабочую оценку эффекта по внутренним циклам студии. Для строгой атрибуции нужен единый baseline по количеству КП, когорте лидов и периоду наблюдения.",
              },
              {
                code: "+",
                label: "Reflection",
                body: "Главный эффект AI появился не там, где он пытался заменить дизайнера, а там, где снимал повторяемую подготовительную работу и ускорял обратную связь. Он оказался слабее в задачах с нестабильным контекстом, неявными критериями качества и высокой ценой ошибки. Поэтому зрелая AI-практика начинается не с модели, а с процесса, владельца решения и обязательного человеческого контроля.",
              },
            ]
          : [
              {
                code: "S",
                label: "Situation",
                body: "Generative AI was already being used by individual contributors, but it was not part of the company workflow. Experiments created local value and depended on personal initiative: there were no shared criteria for selecting tasks, reviewing quality, handing off results, or measuring value.",
                support: [
                  {
                    title: "Users of the change",
                    body: "The solutions were not for an abstract design team. Sales and account managers needed them for proposals; designers and art directors for presales; leadership for quality and process economics.",
                  },
                  {
                    title: "The main risk",
                    body: "Introducing a fashionable tool instead of solving a problem. AI was treated as one possible automation method, not the predetermined answer.",
                  },
                ],
              },
              {
                code: "T",
                label: "Task",
                body: "Find repeatable operations with real business value and turn individual experiments into workflows the whole studio could use.",
                bullets: [
                  "Map the project journey from lead and presale to design production and delivery.",
                  "Score processes by frequency, manual effort, errors, context stability, and potential value.",
                  "Separate tasks suited to scripts or templates from those where an LLM adds contextual value.",
                  "Run pilots, embed human review, and define scaling rules.",
                ],
              },
              {
                code: "A1",
                label: "Process audit",
                body: "I mapped the lifecycle across lead, presale, commercial proposal, discovery, design, and delivery. For each stage, I captured manual effort, repeatability, cost of error, input stability, and expected automation value.",
                support: [
                  {
                    title: "Why these scenarios",
                    body: "Proposal preparation had a stable template, high repetition, and low tolerance for mistakes. Presale prototypes demanded more human judgment but created high value for strategic leads. Final-design generation was not prioritized: context was too unstable and unchecked mistakes too costly.",
                  },
                  {
                    title: "AI vs conventional automation",
                    body: "Where numbers only needed moving, we used deterministic logic. The LLM touched unstructured briefs, semantic grouping, and draft copy. Final calculations and documents always received human review.",
                  },
                ],
              },
              {
                code: "A2",
                label: "Proposal generator",
                body: "We built a microservice that turned a client brief into a commercial proposal using the studio’s existing Excel template. It did not invent a financial model: it structured inputs, prepared the estimate, filled required fields, and returned the document for manager review.",
                bullets: [
                  "Input: brief, project type, scope, timeline, and constraints.",
                  "Processing: AI parsing of unstructured text plus deterministic calculation rules.",
                  "Output: a completed Excel template and a client-ready version.",
                  "Control: mandatory human review before export.",
                ],
                support: [
                  {
                    title: "My ownership",
                    body: "I defined the user workflow, input and output requirements, exception rules, human-review points, and readiness criteria. Engineering implementation was collaborative.",
                  },
                ],
                media: [
                  { src: "/uxart/embed.webp", alt: "Embedded AI tool in the UXART workflow" },
                ],
              },
              {
                code: "A3",
                label: "AI-enhanced presales",
                body: "For the most valuable leads, we enhanced the standard presale with an interactive AI-assisted prototype built in 3–4 days. It accompanied the presentation and proposal — it did not replace them — and let the client experience a possible direction before signing.",
                support: [
                  {
                    title: "Client value",
                    body: "The prototype made conversations concrete, aligned expectations faster, and demonstrated deep involvement. The reaction — “you have already gone this far into our problem” — became an argument for choosing the team.",
                  },
                  {
                    title: "Quality control",
                    body: "Claude Artifacts and image models accelerated production; GitHub Pages provided a live client link. Before the demo, the team checked the core journey, brand, copy, AI limitations, and behavior on the client’s device.",
                  },
                ],
                media: [
                  { src: "/uxart/presale1-1.webp", alt: "First UXART AI-enhanced presale" },
                  { src: "/uxart/presale1-3.webp", alt: "Interactive presale prototype detail" },
                  { src: "/uxart/presale2-1.webp", alt: "Second UXART AI-enhanced presale" },
                  { src: "/uxart/presale2-2.webp", alt: "Interactive version of the second presale" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A4",
                label: "Design automation framework",
                body: "To make the practice tool-independent, I formalized a framework: Discover → Evaluate → Prototype → Validate → Integrate → Scale. It starts with a process bottleneck, selects an appropriate technology, and scales only a validated workflow.",
                bullets: [
                  "Discover — observation and interviews with process participants.",
                  "Evaluate — value, frequency, manual time, errors, and context stability.",
                  "Prototype — the shortest end-to-end pilot on real data.",
                  "Validate — output quality, time, errors, and user trust.",
                  "Integrate — owners, human review, documentation, and handoff.",
                  "Scale — training, reuse, and recurring metric review.",
                ],
              },
              {
                code: "A5",
                label: "Adoption",
                body: "I trained the team and established rules for AI output: one source of truth, known limitations, named owners for visual and interactive review, a handoff README, and an explicit list of items that humans must verify.",
                support: [
                  {
                    title: "Harder than the technology",
                    body: "The challenge was not building a prototype but fitting it into the team’s existing route. Without ownership, review criteria, and clear handoff, even a strong artifact remains a personal experiment.",
                  },
                ],
              },
              {
                code: "R",
                label: "Result",
                body: "AI moved from isolated experimentation into the studio’s commercial and design workflows. The team produced repeatable documents faster, strengthened strategic presales with working prototypes, and gained a shared method for evaluating new automation ideas.",
                metrics: [
                  { value: "−75%", label: "Proposal time", detail: "from 2–3 hours to 25–30 minutes" },
                  { value: "14 → 4", label: "Presale days", detail: "for a priority interactive prototype" },
                  { value: "+15%", label: "Lead conversion", detail: "estimated across strategic presales" },
                  { value: "80%", label: "AI adoption", detail: "estimated share of the design team" },
                  { value: "−50%", label: "Routine documentation", detail: "estimated time on repeated materials" },
                  { value: "60%+", label: "Presale routine", detail: "share of repeatable actions automated" },
                ],
                note: "Percentages are working estimates based on internal studio cycles. Strict attribution requires one baseline for proposal volume, lead cohorts, and observation period.",
              },
              {
                code: "+",
                label: "Reflection",
                body: "AI created the most value when it removed repeatable preparation work and shortened feedback loops — not when it tried to replace designers. It was weaker in tasks with unstable context, implicit quality criteria, and a high cost of error. A mature AI practice therefore starts with a process, an accountable owner, and mandatory human control — not with a model.",
              },
            ]
      }
      nextCase={{ href: "#case/zinda", label: "Zinda" }}
    />
  );
}
