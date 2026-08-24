import { CaseNarrative } from "./CaseNarrative";
import { useLang } from "@/lib/i18n";

const formationIllustrations = [
  undefined,
  [
    { src: "/zinda/product-case/concept-dark.avif", alt: "Тёмная концепция продукта" },
    { src: "/zinda/product-case/concept-calm.avif", alt: "Спокойное направление после компромисса" },
  ],
  [
    { src: "/zinda/product-case/team-tasks.avif", alt: "Артефакт распределения задач и нагрузки" },
    { src: "/zinda/product-case/team-notes.avif", alt: "Заметки после созвона" },
  ],
  undefined,
  [
    { src: "/zinda/product-case/mobile-map.avif", alt: "Карта экранов и состояний мобильного банка" },
  ],
  [
    { src: "/zinda/product-case/mobile-home.avif", alt: "Главная Zinda в мобильной версии" },
    { src: "/zinda/product-case/mobile-payments.avif", alt: "Платежи Zinda в мобильной версии" },
  ],
  undefined,
];

export function CaseZinda() {
  const { lang } = useLang();
  const ru = lang === "ru";

  return (
    <CaseNarrative
      pageClassName="zinda-page zinda-formation-page"
      title={
        ru
          ? "Zinda. От трёх отклонённых концепций к архитектуре B2B-банка"
          : "Zinda. From three rejected concepts to a B2B banking architecture"
      }
      intro={
        ru
          ? "Я присоединился после трёх отклонённых концепций. За четыре месяца мы согласовали направление и передали банк в разработку; продукт позже вышел. Моя зона: multi-account архитектура, MVP-скоуп, ключевые UX-решения и самостоятельное ведение мобильного направления. Детальные состояния и production delivery были командной работой."
          : "I joined after three concepts had been rejected. In four months, we aligned the direction and handed the bank to engineering; the product later shipped. My scope covered the multi-account architecture, MVP scope, key UX decisions, and independent ownership of the mobile direction. Detailed states and production delivery were collaborative."
      }
      tags={
        ru
          ? ["Продуктовый дизайн", "Финтех · B2B", "Multi-account IA", "2023–2024"]
          : ["Product Design", "Fintech · B2B", "Multi-account IA", "2023–2024"]
      }
      hero={
        <div className="case-narrative-hero--figma-export">
          <img
            src="/zinda/product-case/hero.avif"
            alt={ru ? "Главный экран веб-банка Zinda" : "Zinda desktop bank home screen"}
          />
        </div>
      }
      sections={(ru
          ? [
              {
                code: "01",
                label: "Банк без общего образа",
                body: "К моему приходу команда уже подготовила три концепции, но ни одну не согласовали. Банку был нужен практичный B2B-инструмент, брендинговой студии — выразительный флагман, продуктовой команде — понятная и реализуемая система. Проблема была не в недостатке красивых вариантов: у участников не было общего ответа, каким должен быть банк.",
                bullets: [
                  "Три отклонённых визуальных направления.",
                  "Три конкурирующих представления о продукте.",
                  "Юридические ограничения и сложная схема подрядчиков.",
                  "Необходимость одновременно сформировать продукт и способ работы над ним.",
                ],
              },
              {
                code: "02",
                label: "Конфликт и компромисс",
                body: "Мы спорили с заказчиком — иногда жёстко. Банк и брендинговая студия хотели более яркий презентационный продукт, а мы защищали спокойный рабочий интерфейс для предпринимателей и бухгалтеров. Вместо спора о вкусе я учился приносить сценарии, конкурентные примеры и риски реализации.",
                support: [
                  {
                    title: "Что защищали",
                    body: "Архитектуру счетов, понятность ежедневных операций и решения, которые влияли на успешность сценария.",
                  },
                  {
                    title: "Где договаривались",
                    body: "Визуальный тон оставался зоной компромисса. Часть яркости вошла в финальное направление, чтобы сохранить доверие участников и движение проекта.",
                  },
                ],
              },
              {
                code: "03",
                label: "Команду пришлось пересобрать",
                body: "По мере роста банка исходная структура перестала выдерживать масштаб. Мы меняли специалистов, заново распределяли ответственность и разделили концептуальную работу, производство экранов и развитие дизайн-системы. Не всем ролям подошёл новый уровень автономности, поэтому команду усилили нужной экспертизой.",
                support: [
                  {
                    title: "Результат перестройки",
                    body: "У продуктовых блоков появились владельцы, параллельные версии перестали расходиться, а обсуждения с заказчиком начали опираться на одну архитектуру.",
                  },
                ],
              },
              {
                code: "04",
                label: "Архитектура и MVP",
                body: "Я предложил multi-account модель: компания сохраняет контекст, счета остаются равноправными рабочими объектами, а операции открываются из выбранного счёта без лишней вложенности. Чтобы первая версия не распалась на слишком широкий набор обещаний, кредитные продукты вынесли в post-MVP и сфокусировали handoff на базовом банковском контуре.",
              },
              {
                code: "05",
                label: "Что изменилось в продукте",
                body: "Проект вышел из цикла отклонённых концепций: у команды появилась одна согласованная основа, четыре ключевые зоны сложились в общую multi-account архитектуру, а первая версия перестала размываться кредитными сценариями. За четыре месяца направление дошло до handoff; банк позже вышел.",
                support: [
                  {
                    title: "Результат для MVP",
                    body: "Кредитные продукты перенесли в post-MVP, а handoff сфокусировали на базовом банковском контуре: главной, платежах, профиле и чате.",
                  },
                  {
                    title: "Результат для моей роли",
                    body: "После работы над общей концепцией я самостоятельно повёл мобильное направление от аудита веб-сценариев до прототипов и спецификаций.",
                  },
                ],
                metrics: [
                  { value: "3 → 1", label: "Продуктовая основа", detail: "Три отклонённые концепции свели в одно согласованное направление." },
                  { value: "4", label: "Ключевые зоны", detail: "Главная, платежи, профиль и чат." },
                  { value: "2", label: "Платформы", detail: "Веб-продукт и мобильное приложение." },
                  { value: "≈ 40", label: "Экраны и состояния", detail: "Масштаб ключевых банковских сценариев в проекте; решения и детализация распределялись внутри команды." },
                ],
              },
              {
                code: "06",
                label: "Мобильное приложение как следующая ответственность",
                body: "Перенос банка на мобильные устройства стал моментом, когда моя роль окончательно изменилась. Я уже не детализировал чужую концепцию, а самостоятельно определял приоритеты, адаптировал веб-логику и собирал направление до передачи в разработку. Этой работе посвящён отдельный кейс.",
              },
              {
                code: "+",
                label: "Результат и рефлексия",
                body: "Zinda не была линейным проектом, поэтому результат здесь не маскируется выдуманной продуктовой метрикой. Доказательства — вышедший банк, handoff за четыре месяца, единая архитектура четырёх зон, сокращённый MVP и отдельное мобильное направление, которое я довёл самостоятельно. Проект стал моим переходом от дизайнера интерфейсов к продуктовому специалисту, который выдерживает неопределённость и отвечает за направление целиком.",
                metrics: [
                  { value: "3 → 1", label: "Визуальное направление", detail: "Три отклонённые концепции свели в одну согласованную продуктовую основу." },
                  { value: "4 месяца", label: "До handoff", detail: "Период от нового концептного направления до передачи в разработку." },
                  { value: "4", label: "Зоны в одной архитектуре", detail: "Главная, платежи, профиль и чат развивались как части одного банка." },
                  { value: "1 направление", label: "Самостоятельное ведение", detail: "Мобильная версия — от аудита веб-сценариев до спецификаций для разработки." },
                ],
              },
            ]
          : [
              {
                code: "01",
                label: "A bank without a shared vision",
                body: "By the time I joined, the team had produced three concepts and failed to align any of them. The bank needed a practical B2B tool, the branding studio wanted an expressive flagship, and the product team needed a clear and buildable system. The problem was not a lack of attractive options — there was no shared answer to what the bank should be.",
                bullets: [
                  "Three rejected visual directions.",
                  "Three competing ideas of the product.",
                  "Legal constraints and a layered contractor setup.",
                  "A need to shape both the product and the way the team worked.",
                ],
              },
              {
                code: "02",
                label: "Conflict and compromise",
                body: "We argued with the client — sometimes intensely. The bank and branding studio wanted a brighter, more presentational product, while we defended a calmer daily tool for entrepreneurs and accountants. I learned to move the discussion away from taste and toward usage scenarios, competitive evidence, and delivery risks.",
                support: [
                  {
                    title: "What we defended",
                    body: "The account architecture, clarity of daily operations, and decisions affecting task completion.",
                  },
                  {
                    title: "Where we compromised",
                    body: "The visual tone remained negotiable. Some intensity entered the final direction to preserve trust and keep the project moving.",
                  },
                ],
              },
              {
                code: "03",
                label: "Rebuilding the team",
                body: "As the bank grew, the original team structure stopped matching the scale. We changed specialists, redistributed ownership, and separated concept work, screen production, and design-system development. Not every role fit the new level of autonomy, so we brought in the expertise the product needed.",
                support: [
                  {
                    title: "What changed",
                    body: "Product areas gained owners, parallel versions stopped drifting, and client discussions became grounded in one architecture.",
                  },
                ],
              },
              {
                code: "04",
                label: "Architecture and MVP",
                body: "I proposed a multi-account model: the company preserves context, accounts remain equal working objects, and operations start from the selected account without unnecessary nesting. To keep the first version from fragmenting into too many promises, lending moved to post-MVP and the handoff focused on the core banking scope.",
              },
              {
                code: "05",
                label: "What changed in the product",
                body: "The project moved beyond a cycle of rejected concepts: the team gained one aligned foundation, four core areas became one multi-account architecture, and lending stopped diluting the first release. The direction reached handoff in four months, and the bank later shipped.",
                support: [
                  {
                    title: "Outcome for the MVP",
                    body: "Lending moved to post-MVP while handoff focused on the core banking scope: home, payments, profile, and chat.",
                  },
                  {
                    title: "Outcome for my role",
                    body: "After contributing to the shared concept, I independently led mobile from the desktop-flow audit to prototypes and specifications.",
                  },
                ],
                metrics: [
                  { value: "3 → 1", label: "Product foundation", detail: "Three rejected concepts converged into one aligned direction." },
                  { value: "4", label: "Core areas", detail: "Home, payments, profile, and chat." },
                  { value: "2", label: "Platforms", detail: "Desktop product and mobile application." },
                  { value: "≈ 40", label: "Screens and states", detail: "Scale of the core banking journeys; decisions and detailed production were distributed across the team." },
                ],
              },
              {
                code: "06",
                label: "Mobile as the next responsibility",
                body: "Moving the bank to mobile marked the final shift in my role. I was no longer detailing somebody else's concept: I set priorities, adapted the desktop logic, and carried the direction toward handoff. That work became a separate case.",
              },
              {
                code: "+",
                label: "Outcome and reflection",
                body: "Zinda was not a linear project, so its outcome is not dressed up with an invented product metric. The evidence is a shipped bank, handoff in four months, one architecture across four areas, a focused MVP, and a mobile direction I took forward independently. The project marked my transition from interface designer to a product specialist able to hold uncertainty and own a direction.",
                metrics: [
                  { value: "3 → 1", label: "Visual direction", detail: "Three rejected concepts converged into one aligned product foundation." },
                  { value: "4 months", label: "To handoff", detail: "From the new concept direction to engineering handoff." },
                  { value: "4", label: "Areas in one architecture", detail: "Home, payments, profile, and chat evolved as one bank." },
                  { value: "1 direction", label: "Independent ownership", detail: "Mobile from desktop-flow audit to engineering specifications." },
                ],
              },
            ]).map((section, index) => {
              const media = formationIllustrations[index];

              return {
                ...section,
                media,
                mediaClassName: media
                  ? `case-narrative-media--figma-export${
                      media.length === 2 ? " case-narrative-media--figma-pair" : ""
                    }${
                      index === 5
                        ? " case-narrative-media--figma-pair-asymmetric case-narrative-media--gap-24"
                        : index === 4
                          ? " case-narrative-media--flush"
                          : ""
                    }`
                  : undefined,
              };
            })}
      nextCase={{ href: "#case/zinda-system", label: ru ? "Дизайн-система" : "Design system" }}
    />
  );
}
