import { useLang } from "@/lib/i18n";
import { CaseNarrative } from "./CaseNarrative";

export function CaseZinda() {
  const ru = useLang().lang === "ru";

  return (
    <CaseNarrative
      pageClassName="zinda-page"
      brand="Тимофей Ермолаев"
      title={
        ru
          ? "Как мы провели первый цифровой банк Таджикистана через четыре итерации согласования."
          : "Launching Tajikistan’s first digital bank through four rounds of stakeholder alignment."
      }
      intro={
        ru
          ? "Я присоединился после трёх отклонённых концепций, стабилизировал дизайн-процесс и помог свести в один продукт три конкурирующих видения: банка, брендинговой студии и продуктовой команды. За шесть месяцев мы довели MVP для web и mobile до передачи в разработку."
          : "I joined after three rejected concepts, stabilized the design process, and helped align three competing visions: the bank, the branding studio, and the product team. Within six months, we took the web and mobile MVP to engineering handoff."
      }
      tags={
        ru
          ? ["Senior Product Design", "Fintech · B2B", "Web + Mobile", "6 месяцев"]
          : ["Senior Product Design", "Fintech · B2B", "Web + Mobile", "6 months"]
      }
      hero={
        <img
          src="/zinda/hero-laptop.webp"
          alt={ru ? "Интерфейс цифрового банка Zinda" : "Zinda digital banking interface"}
        />
      }
      sections={
        ru
          ? [
              {
                code: "S",
                label: "Situation",
                body: "Проект находился почти на стадии чистого листа. До моего прихода команда подготовила три визуальные концепции, но ни одну не удалось согласовать. У заказчика не было сформированного образа цифрового продукта, а сложная схема подрядчиков добавляла ещё один слой неопределённости: наша продуктовая команда работала через брендинговую студию.",
                bullets: [
                  "Банк ожидал рабочий B2B-инструмент для предпринимателей и бухгалтеров.",
                  "Брендинговой студии был нужен выразительный флагманский кейс.",
                  "Продуктовой команде предстояло сохранить понятный ежедневный UX и выполнить юридические требования Таджикистана.",
                  "Дедлайн MVP — шесть месяцев.",
                ],
                media: [
                  { src: "/zinda/three-variants.webp", alt: "Итерации визуальной концепции Zinda" },
                  { src: "/zinda/concept.webp", alt: "Концепция цифрового банка Zinda" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "T",
                label: "Task",
                body: "Формально меня пригласили резко поднять качество UI. На практике зона ответственности быстро стала шире: требовалось перезапустить дизайн-процесс, определить продуктовую концепцию, спроектировать банковские сценарии и провести их через согласование до MVP.",
                support: [
                  {
                    title: "Моя роль",
                    body: "Я отвечал за концепцию приложения, ключевые UX- и архитектурные решения, презентацию дизайна на встречах с заказчиком и синхронизацию команды. Дизайнеры детализировали состояния экранов и развивали дизайн-систему.",
                  },
                  {
                    title: "Продуктовая задача",
                    body: "Нужно было упростить открытие счёта и карты в условиях глубокой бюрократизации, не нарушая обязательные юридические шаги, а затем собрать рабочую основу для будущих кредитных и финансовых сервисов.",
                  },
                ],
              },
              {
                code: "A1",
                label: "Research & framing",
                body: "Мы начали с анализа российского финтех-рынка как наиболее зрелого и близкого по контексту. Сравнили ключевые B2B-паттерны, онбординг, работу со счетами и плотность ежедневных интерфейсов, затем отфильтровали решения через локальные юридические ограничения.",
                bullets: [
                  "Сформулировали продукт как ежедневный рабочий инструмент, а не витрину бренда.",
                  "Сначала закрепили логику основных сценариев, затем визуальный язык.",
                  "Кредитные продукты вынесли за пределы MVP, сохранив фокус на базовом банковском контуре.",
                ],
                media: [
                  { src: "/zinda/research-1.webp", alt: "Анализ конкурентов для Zinda" },
                  { src: "/zinda/research-2.webp", alt: "Синтез продуктового исследования Zinda" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A2",
                label: "Team & ownership",
                body: "Я разделил концептуальную работу и производство экранов. После замены одного из дизайнеров мы усилили команду специалистом по дизайн-системам: я держал архитектуру, визуальное направление и коммуникацию со стейкхолдерами, команда — состояния, компоненты и системную детализацию.",
                support: [
                  {
                    title: "Почему это сработало",
                    body: "Решения перестали расползаться между параллельными итерациями. У каждой части появился владелец, а обсуждения с заказчиком опирались на одну согласованную концепцию.",
                  },
                ],
                media: [
                  { src: "/zinda/concept-bento-laptop.webp", alt: "Концепция Zinda на desktop" },
                  { src: "/zinda/concept-bento-channels.webp", alt: "Продуктовые сценарии Zinda" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A3",
                label: "Stakeholder alignment",
                body: "Главный спор шёл вокруг визуального характера продукта. Мы последовательно объясняли, почему яркий и пёстрый интерфейс плохо подходит бухгалтеру, который работает с банком каждый день по несколько часов. Вместо спора о вкусе я приносил сценарии использования, конкурентные примеры и ограничения платформы.",
                support: [
                  {
                    title: "Четыре итерации",
                    body: "Каждый раунд не просто менял оформление: мы отделяли защищаемую UX-логику от субъективных визуальных предпочтений. Так удалось сохранить более спокойную основу, не остановив проект в бесконечном согласовании.",
                  },
                  {
                    title: "Осознанный компромисс",
                    body: "Часть пестроты всё же попала в финальное направление ради брендинговой выразительности. Я до сих пор считаю этот слой избыточным для ежедневного B2B-сервиса, но компромисс позволил сохранить доверие участников и довести MVP до релиза.",
                  },
                ],
                media: [
                  { src: "/zinda/tone-1.webp", alt: "Первая версия визуального тона Zinda" },
                  { src: "/zinda/tone-2.webp", alt: "Более сдержанная версия визуального тона Zinda" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "R",
                label: "Result",
                body: "За шесть месяцев мы подготовили web- и mobile-MVP и передали продукт в дальнейшую разработку. После этого банк продолжил развиваться в сторону кредитных и денежных сервисов, а заказчик приглашал меня остаться в команде.",
                metrics: [
                  { value: "6 мес.", label: "MVP", detail: "от перезапуска концепции до handoff" },
                  { value: "−30%", label: "Цикл согласования", detail: "оценка после перестройки коммуникации" },
                  { value: "100%", label: "Ключевые сценарии", detail: "покрытие банковского контура MVP" },
                  { value: "+20%", label: "Эффективность команды", detail: "оценка скорости производства после разделения ролей" },
                ],
                note: "Процентные значения — рабочая оценка эффекта по проектным циклам; они не основаны на отдельном A/B-тесте и должны читаться вместе с указанным baseline.",
                media: [
                  { src: "/zinda/macbook-1.webp", alt: "Финальный интерфейс Zinda на desktop" },
                  { src: "/zinda/main-screen-phone.webp", alt: "Финальный интерфейс Zinda на mobile" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "+",
                label: "Reflection",
                body: "Главный урок — экспертность сама по себе не гарантирует доверия. Сильное решение приходится переводить на язык сценариев, бизнеса и рисков, иногда несколько раз. Сейчас я бы ещё до первой детальной концепции провёл совместный продуктовый воркшоп с банком и брендинговой студией: это раньше отделило бы измеримые задачи от субъективных ожиданий.",
              },
            ]
          : [
              {
                code: "S",
                label: "Situation",
                body: "The project was still close to a blank slate. Before I joined, the team had produced three visual concepts and failed to get any approved. The client had no defined vision for the digital product, while the contractor setup added another layer of ambiguity: our product team worked through a branding studio.",
                bullets: [
                  "The bank expected a practical B2B tool for business owners and accountants.",
                  "The branding studio wanted an expressive flagship case.",
                  "The product team had to preserve a clear daily UX and meet Tajikistan’s legal requirements.",
                  "The MVP deadline was six months.",
                ],
                media: [
                  { src: "/zinda/three-variants.webp", alt: "Zinda visual concept iterations" },
                  { src: "/zinda/concept.webp", alt: "Zinda digital banking concept" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "T",
                label: "Task",
                body: "I was formally invited to raise the UI quality. In practice, the scope quickly became broader: restart the design process, define the product concept, design the banking journeys, and take them through alignment to MVP.",
                support: [
                  {
                    title: "My role",
                    body: "I owned the app concept, key UX and architectural decisions, design presentations with the client, and team alignment. Other designers detailed screen states and developed the design system.",
                  },
                  {
                    title: "Product challenge",
                    body: "We had to simplify account and card opening within a deeply bureaucratic environment, while keeping every mandatory legal step and creating a foundation for future credit and financial services.",
                  },
                ],
              },
              {
                code: "A1",
                label: "Research & framing",
                body: "We started with the Russian fintech market as the closest mature benchmark. We compared core B2B patterns, onboarding, account management, and information density, then filtered them through local legal constraints.",
                bullets: [
                  "Framed the product as a daily work tool rather than a brand showcase.",
                  "Locked the logic of core journeys before the visual language.",
                  "Moved credit products outside the MVP to protect the core banking scope.",
                ],
                media: [
                  { src: "/zinda/research-1.webp", alt: "Zinda competitor research" },
                  { src: "/zinda/research-2.webp", alt: "Zinda research synthesis" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A2",
                label: "Team & ownership",
                body: "I separated concept work from screen production. After replacing one designer, we strengthened the team with a design-systems specialist: I held architecture, visual direction, and stakeholder communication; the team owned states, components, and systematic detailing.",
                support: [
                  {
                    title: "Why it worked",
                    body: "Decisions stopped drifting across parallel iterations. Every part had an owner, and client discussions were grounded in one shared concept.",
                  },
                ],
                media: [
                  { src: "/zinda/concept-bento-laptop.webp", alt: "Zinda desktop concept" },
                  { src: "/zinda/concept-bento-channels.webp", alt: "Zinda product journeys" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A3",
                label: "Stakeholder alignment",
                body: "The main conflict was the product’s visual character. We repeatedly explained why a bright, saturated interface was a poor fit for accountants spending hours in it every day. Instead of debating taste, I brought usage scenarios, competitor evidence, and platform constraints.",
                support: [
                  {
                    title: "Four iterations",
                    body: "Each round did more than change styling: we separated defensible UX logic from subjective visual preferences. This preserved a calmer foundation without trapping the project in endless approval loops.",
                  },
                  {
                    title: "A conscious trade-off",
                    body: "Some visual intensity still reached the final direction to support the branding ambition. I still consider it excessive for a daily B2B service, but accepting part of it protected stakeholder trust and kept the MVP moving.",
                  },
                ],
                media: [
                  { src: "/zinda/tone-1.webp", alt: "First Zinda visual tone" },
                  { src: "/zinda/tone-2.webp", alt: "Calmer Zinda visual tone" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "R",
                label: "Result",
                body: "Within six months, we prepared the web and mobile MVP and handed it into further development. The bank continued expanding toward credit and financial services, and the client invited me to stay with the team.",
                metrics: [
                  { value: "6 mo.", label: "MVP", detail: "from concept reset to handoff" },
                  { value: "−30%", label: "Approval cycle", detail: "estimated after communication reset" },
                  { value: "100%", label: "Core journeys", detail: "coverage of the MVP banking scope" },
                  { value: "+20%", label: "Team efficiency", detail: "estimated production gain after role split" },
                ],
                note: "Percentage values are directional project estimates rather than the result of a dedicated A/B test; they should be read together with the stated baseline.",
                media: [
                  { src: "/zinda/macbook-1.webp", alt: "Final Zinda desktop interface" },
                  { src: "/zinda/main-screen-phone.webp", alt: "Final Zinda mobile interface" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "+",
                label: "Reflection",
                body: "The main lesson was that expertise alone does not create trust. Strong decisions must be translated into user scenarios, business outcomes, and risks — sometimes more than once. Today I would run a joint product workshop with the bank and branding studio before the first high-fidelity concept, separating measurable tasks from subjective expectations much earlier.",
              },
            ]
      }
      nextCase={{ href: "#case/ovork", label: "ОВорк" }}
    />
  );
}
