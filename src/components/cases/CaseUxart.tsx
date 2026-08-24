import { CaseNarrative } from "./CaseNarrative";
import { useLang } from "@/lib/i18n";

export function CaseUxart() {
  const { lang } = useLang();
  const ru = lang === "ru";

  return (
    <CaseNarrative
      pageClassName="uxart-page"
      title={
        ru
          ? "Из AI-экспериментов — в рабочий процесс студии"
          : "From AI experiments to a studio workflow"
      }
      intro={
        ru
          ? "Работая продуктовым дизайнером в UXART, я провёл аудит повторяемых операций и запустил три практики: генератор коммерческих предложений, интерактивные AI-пресейлы и фреймворк оценки автоматизаций. Моя зона — процесс, требования, прототипы, human review, обучение и передача; техническую реализацию мы собирали вместе с разработкой."
          : "While working as a product designer at UXART, I audited repeatable operations and launched three practices: a proposal generator, interactive AI-assisted presales, and an automation-evaluation framework. I owned the workflow, requirements, prototypes, human review, training, and handoff; implementation was collaborative with engineering."
      }
      tags={
        ru
          ? ["AI-трансформация", "Дизайн-операции", "Сервисный дизайн", "2025"]
          : ["AI Transformation", "Design Operations", "Service Design", "2025"]
      }
      hero={
        <div className="case-narrative-hero--split case-narrative-hero--figma-export">
          <img src="/uxart/bani-final-hero.avif" alt={ru ? "Финальная главная страница сайта Приморских бань" : "Final Primorskie Bani website home page"} />
          <img src="/uxart/bani-final-services.avif" alt={ru ? "Финальный раздел услуг сайта Приморских бань" : "Final Primorskie Bani website services section"} />
        </div>
      }
      sections={
        ru
          ? [
              {
                code: "S",
                label: "Ситуация",
                body: "Генеративный AI уже использовался отдельными сотрудниками, но не был частью рабочего процесса компании. Эксперименты давали локальный эффект и зависели от личной инициативы: не было общих критериев выбора задач, проверки качества, передачи результата или измерения пользы.",
                support: [
                  {
                    title: "Пользователи изменений",
                    body: "Решения создавались не для абстрактной «дизайн-команды». Ими должны были пользоваться менеджеры по продажам и работе с клиентами при подготовке КП, дизайнеры и арт-дирекция в пресейле, а руководители — для контроля качества и экономики процесса.",
                  },
                  {
                    title: "Главный риск",
                    body: "Внедрить модный инструмент вместо решения проблемы. Поэтому AI рассматривался как один из вариантов автоматизации, а не как заранее выбранный ответ.",
                  },
                ],
              },
              {
                code: "T",
                label: "Задача",
                body: "Нужно было найти повторяемые операции с реальным бизнес-эффектом и превратить индивидуальные эксперименты в процессы, которыми может пользоваться вся студия.",
                bullets: [
                  "Разобрать путь проекта от лида и пресейла до дизайн-производства и передачи результата.",
                  "Оценить процессы по частоте, ручным затратам, ошибкам, стабильности контекста и потенциальной ценности.",
                  "Отделить задачи для скрипта или шаблона от задач, где LLM действительно нужен для работы с контекстом.",
                  "Запустить пилоты, встроить человеческую проверку и зафиксировать правила масштабирования.",
                ],
              },
              {
                code: "A1",
                label: "Аудит процесса",
                body: "Я разложил жизненный цикл проекта на лид, пресейл, коммерческое предложение, исследование, дизайн и передачу результата. Для каждого этапа фиксировал объём ручной работы, повторяемость, цену ошибки, стабильность входных данных и ожидаемый эффект автоматизации.",
                support: [
                  {
                    title: "Почему выбрали эти сценарии",
                    body: "Подготовка КП имела стабильный шаблон, высокую повторяемость и низкую допустимость ошибок. Пресейл-прототипы требовали больше человеческого решения, но давали высокую ценность в стратегических лидах. Автогенерацию финального дизайна не приоритизировали: контекст был слишком нестабилен, а цена непроверенной ошибки — высокой.",
                  },
                  {
                    title: "Критерий выбора AI или обычной автоматизации",
                    body: "Там, где достаточно переносить числа, использовалась детерминированная логика. Языковая модель подключалась только к неструктурированному брифу, смысловой группировке и черновому тексту. Итоговые расчёты и документ всегда проходили человеческую проверку.",
                  },
                ],
              },
              {
                code: "A2",
                label: "Генератор коммерческих предложений",
                body: "Мы создали микросервис, который превращал клиентский бриф в коммерческое предложение по существующему Excel-шаблону. Сервис не придумывал финансовую модель: он структурировал входные данные, подготавливал оценку, заполнял обязательные поля и возвращал документ на ревью менеджеру.",
                bullets: [
                  "Вход: бриф, тип проекта, состав работ, сроки и ограничения.",
                  "Обработка: AI-разбор неструктурированного текста и детерминированные правила расчёта.",
                  "Выход: заполненный Excel-шаблон и версия для отправки клиенту.",
                  "Контроль: обязательная человеческая проверка перед экспортом.",
                ],
                support: [
                  {
                    title: "Моя зона ответственности",
                    body: "Я описал пользовательский процесс, требования к входам и выходам, правила исключений, точки человеческой проверки и критерии готовности. Техническую реализацию собирали вместе с разработкой.",
                  },
                ],
                media: [
                  { src: "/uxart/bani-final-complex.avif", alt: "Финальный раздел комплекса сайта Приморских бань" },
                ],
              },
              {
                code: "A3",
                label: "AI-усиленные пресейлы",
                body: "Для наиболее ценных лидов мы усилили стандартный пресейл интерактивным прототипом с AI, собранным за 3–4 дня. Он шёл вместе с презентацией и коммерческим предложением — не заменял их, а давал клиенту возможность «потрогать» возможное направление до подписания договора.",
                support: [
                  {
                    title: "Зачем это было клиенту",
                    body: "Прототип делал разговор предметным, быстрее синхронизировал ожидания и показывал уровень вовлечённости студии. Реакция «вы уже так глубоко погрузились в нашу задачу» стала самостоятельным аргументом в пользу команды.",
                  },
                  {
                    title: "Как контролировали качество",
                    body: "Claude Artifacts и модели генерации изображений ускоряли сборку, GitHub Pages давал клиенту живую ссылку. До показа команда проверяла основной сценарий, бренд, контент, ограничения AI-результата и поведение на устройстве клиента.",
                  },
                ],
                media: [
                  { src: "/uxart/presale1-1.webp", alt: "Первый AI-усиленный пресейл UXART" },
                  { src: "/uxart/presale1-3.webp", alt: "Деталь интерактивного пресейл-прототипа" },
                  { src: "/uxart/bani-final-pricing.avif", alt: "Финальный раздел тарифов сайта Приморских бань" },
                  { src: "/uxart/bani-final-news.avif", alt: "Финальный раздел новостей сайта Приморских бань" },
                ],
                mediaClassName: "case-narrative-media--uxart-presales",
              },
              {
                code: "A4",
                label: "Фреймворк автоматизации дизайна",
                body: "Чтобы практика не зависела от конкретного инструмента, я оформил собственный фреймворк: Discover → Evaluate → Prototype → Validate → Integrate → Scale. Он помогает команде начинать с узкого места процесса, выбирать подходящую технологию и масштабировать только проверенный сценарий.",
                bullets: [
                  "Discover — наблюдение и интервью с участниками процесса.",
                  "Evaluate — ценность, частота, ручное время, ошибки и стабильность контекста.",
                  "Prototype — самый короткий сквозной пилот на реальных данных.",
                  "Validate — качество результата, время, ошибки и доверие пользователя.",
                  "Integrate — владельцы, человеческая проверка, документация и передача.",
                  "Scale — обучение, повторное использование и регулярный пересмотр метрик.",
                ],
              },
              {
                code: "A5",
                label: "Внедрение",
                body: "Я провёл обучение команды и зафиксировал правила работы с AI-результатом: единый источник правды, известные ограничения, ответственные за визуальную и интерактивную проверку, инструкция для передачи и список того, что обязательно проверяет человек.",
                support: [
                  {
                    title: "Что оказалось сложнее технологии",
                    body: "Не собрать прототип, а встроить его в привычный маршрут команды. Без владельца, критериев ревью и понятной передачи даже сильный артефакт остаётся личным экспериментом.",
                  },
                ],
              },
              {
                code: "R",
                label: "Результат",
                body: "AI перестал быть личным экспериментом и вошёл в коммерческий и дизайн-процесс студии. В пилоте генератор сокращал подготовку КП с 2–3 часов до 25–30 минут. После ретро, нового delivery-пакета и обучения следующий интерактивный пресейл выиграли, а live-прототипы закрепили как повторяемый формат. Эти сигналы описывают пилот и последовательность конкретных пресейлов — не общую конверсию всех лидов студии.",
                metrics: [
                  { value: "2–3 ч → 25–30 мин", label: "Подготовка КП", detail: "Замер пилота на повторяемом шаблоне с обязательной проверкой менеджером." },
                  { value: "3–4 дня", label: "Live-прототип", detail: "Срок сборки приоритетного интерактивного пресейла." },
                  { value: "1 выигран", label: "Следующий пресейл", detail: "Факт после ретро, обучения и перехода на новый delivery-процесс." },
                  { value: "3 практики", label: "Внедрение", detail: "КП, интерактивные пресейлы и общий фреймворк оценки автоматизаций." },
                ],
              },
              {
                code: "+",
                label: "Рефлексия",
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
                  { src: "/uxart/bani-final-complex.avif", alt: "Final Primorskie Bani website complex section" },
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
                  { src: "/uxart/bani-final-pricing.avif", alt: "Final Primorskie Bani website pricing section" },
                  { src: "/uxart/bani-final-news.avif", alt: "Final Primorskie Bani website news section" },
                ],
                mediaClassName: "case-narrative-media--uxart-presales",
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
                body: "AI moved from personal experimentation into the studio’s commercial and design workflows. In the pilot, the proposal generator reduced preparation from 2–3 hours to 25–30 minutes. After the retrospective, a new delivery package, and team training, the next interactive presale was won and live prototypes became a repeatable format. These signals describe a pilot and a sequence of specific presales, not the conversion rate of every studio lead.",
                metrics: [
                  { value: "2–3 h → 25–30 min", label: "Proposal preparation", detail: "Pilot measurement on a repeatable template with mandatory manager review." },
                  { value: "3–4 days", label: "Live prototype", detail: "Build time for a priority interactive presale." },
                  { value: "1 won", label: "Next presale", detail: "Observed after the retrospective, training, and the new delivery process." },
                  { value: "3 practices", label: "Adoption", detail: "Proposals, interactive presales, and a shared automation-evaluation framework." },
                ],
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
