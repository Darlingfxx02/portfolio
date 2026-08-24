import { CaseNarrative } from "./CaseNarrative";
import { useLang } from "@/lib/i18n";

const systemIllustrations = [
  [
    { src: "/zinda/system-case/growth-token.avif", alt: "Семантические токены дизайн-системы" },
  ],
  [
    { src: "/zinda/system-case/foundation-icons.avif", alt: "Общий набор продуктовых иконок" },
    { src: "/zinda/system-case/foundation-flags.avif", alt: "Система валютных и страновых флагов" },
  ],
  [
    { src: "/zinda/system-case/button-states.avif", alt: "Матрица размеров, приоритетов и состояний кнопки" },
  ],
  [
    { src: "/zinda/system-case/product-chat-mobile.avif", alt: "Компоненты системы в мобильном чате" },
    { src: "/zinda/system-case/product-payments-mobile.avif", alt: "Компоненты системы в мобильных платежах" },
  ],
  [
    { src: "/zinda/system-case/chat-desktop.avif", alt: "Чат Zinda в светлой теме" },
  ],
  [
    { src: "/zinda/system-case/organizer.avif", alt: "Структура Organizer и компоненты статусов" },
    { src: "/zinda/system-case/update-date.avif", alt: "Метка даты обновления дизайн-системы" },
  ],
];

export function CaseZindaSystem() {
  const { lang } = useLang();
  const ru = lang === "ru";

  return (
    <CaseNarrative
      pageClassName="zinda-page zinda-system-page"
      title={
        ru
          ? "Дизайн-система Zinda. Общий язык для растущего банка"
          : "Zinda Design System. One language for a growing bank"
      }
      intro={
        ru
          ? "Платежи, профиль, чат и мобильное направление развивались параллельно. Чтобы интерфейс не распадался на локальные решения, мы систематизировали основы, состояния компонентов, темы и правила применения в реальных банковских сценариях."
          : "Payments, Profile, Chat, and mobile evolved in parallel. To keep the interface from fragmenting into local solutions, we systematized foundations, component states, themes, and rules for real banking journeys."
      }
      tags={
        ru
          ? ["Дизайн-системы", "Финтех", "Веб + мобильное приложение", "Светлая + тёмная темы"]
          : ["Design Systems", "Fintech", "Web + Mobile", "Light + Dark"]
      }
      hero={
        <div className="case-narrative-hero--figma-export">
          <img
            src="/zinda/system-case/hero.avif"
            alt={ru ? "Документация и компоненты дизайн-системы Zinda" : "Zinda design-system documentation and components"}
          />
        </div>
      }
      sections={(ru
          ? [
              {
                code: "01",
                label: "Проблема роста",
                body: "Новые функции появлялись быстрее, чем стабилизировались общие правила. Одни и те же действия получали разные визуальные решения, а состояния приходилось повторно продумывать в каждом продуктовом потоке.",
                support: [
                  {
                    title: "Цель",
                    body: "Не собрать красивую витрину компонентов, а снизить продуктовую энтропию и дать нескольким направлениям устойчивый способ развиваться.",
                  },
                ],
              },
              {
                code: "02",
                label: "Основы",
                body: "Система началась с повторяемых основ: режимов цвета, типографики, иконок и флагов. В Figma заложены Light, Dark, Elevated и отдельные IC-режимы — компоненты проектировались сразу для разных поверхностей.",
                metrics: [
                  { value: "6", label: "Цветовые режимы", detail: "Light, Dark, Elevated и IC-варианты." },
                  { value: "2", label: "Темы", detail: "Светлый и тёмный продуктовый контекст." },
                  { value: "2", label: "Платформы", detail: "Общие правила для веба и мобильного приложения." },
                  { value: "4", label: "Продуктовые зоны", detail: "Главная, платежи, профиль и чат." },
                ],
              },
              {
                code: "03",
                label: "Компоненты и состояния",
                body: "Мы собрали не один базовый вариант, а рабочую матрицу размеров, приоритетов и состояний. Кнопки, поля ввода, метки, чипы, списки, подсказки и опасные действия должны были одинаково вести себя в платежах, профиле и коммуникации.",
              },
              {
                code: "04",
                label: "Система в продукте",
                body: "Компоненты проверялись не на отдельной витрине, а в самых плотных продуктовых областях. Платежные шаблоны, история операций, управление сотрудниками, документы и роли заставляли систему выдерживать реальную банковскую сложность.",
              },
              {
                code: "05",
                label: "Темы — не перекраска",
                body: "В чате существовали отдельные светлая и тёмная ветки. Это заставило проверить контраст, поверхности, системные статусы и выразительность акцентного цвета в двух полноценных средах, а не просто инвертировать фон.",
              },
              {
                code: "06",
                label: "Поддержка системы",
                body: "В UI Kit остались даты обновлений, устаревшие зоны и отдельный Organizer. Это важнее красивого числа компонентов: система существовала как изменяемый продукт с обновлениями, устаревшими решениями и правилами владения.",
              },
              {
                code: "+",
                label: "Результат",
                body: "После ревизии локальных наборов мы объединили повторяющиеся компоненты и состояния в одну библиотеку. Общий язык связал веб, мобильное приложение, светлую и тёмную темы. Без продуктовой аналитики я не приписываю системе процент ускорения: доказательство здесь — один поддерживаемый UI Kit, матрицы состояний и повторное применение в четырёх продуктовых зонах.",
                metrics: [
                  { value: "1", label: "Источник истины", detail: "Общий UI Kit для веба, мобильного приложения и тем." },
                  { value: "6", label: "Цветовые режимы", detail: "Режимы для разных поверхностей и контекстов." },
                  { value: "2", label: "Платформы", detail: "Общие правила для веба и мобильного приложения." },
                  { value: "4", label: "Продуктовые зоны", detail: "Главная, платежи, профиль и чат." },
                ],
              },
            ]
          : [
              {
                code: "01",
                label: "The growth problem",
                body: "New features appeared faster than shared rules could stabilize. The same actions received different visual solutions, and states had to be rethought in every product flow.",
                support: [
                  {
                    title: "Goal",
                    body: "Not a polished UI-kit showcase, but lower product entropy and a stable way for several areas to evolve.",
                  },
                ],
              },
              {
                code: "02",
                label: "Foundations",
                body: "The system started with reusable foundations: color modes, typography, icons, and flags. Figma contains Light, Dark, Elevated, and dedicated IC modes, so components were designed for different surfaces from the start.",
                metrics: [
                  { value: "6", label: "Color modes", detail: "Light, Dark, Elevated, and IC variants." },
                  { value: "2", label: "Themes", detail: "Light and dark product environments." },
                  { value: "2", label: "Platforms", detail: "Shared rules for desktop and mobile." },
                  { value: "4", label: "Product areas", detail: "Home, payments, profile, and chat." },
                ],
              },
              {
                code: "03",
                label: "Components and states",
                body: "We built a working matrix of sizes, priorities, and states rather than a single default. Buttons, inputs, badges, chips, lists, tooltips, and destructive actions needed to behave consistently across payments, profile, and communication.",
              },
              {
                code: "04",
                label: "The system in product",
                body: "Components were tested in the densest product areas, not in an isolated showcase. Payment templates, transaction history, employee management, documents, and roles forced the system to hold real banking complexity.",
              },
              {
                code: "05",
                label: "Themes are not recoloring",
                body: "Chat had separate light and dark branches. This forced us to validate contrast, surfaces, system statuses, and the accent color in two complete environments instead of merely inverting the background.",
              },
              {
                code: "06",
                label: "Maintaining the system",
                body: "The UI-kit contains update dates, legacy areas, and a dedicated Organizer. That matters more than an attractive component count: the system existed as a changing product with updates, deprecations, and ownership rules.",
              },
              {
                code: "+",
                label: "Outcome",
                body: "After auditing local sets, we consolidated repeated components and states into one library. A shared language connected desktop, mobile, light, and dark themes. Without product analytics, I do not claim a percentage speed increase: the evidence is one maintained UI kit, explicit state matrices, and reuse across four product areas.",
                metrics: [
                  { value: "1", label: "Source of truth", detail: "One UI kit for desktop, mobile, and themes." },
                  { value: "6", label: "Color modes", detail: "Modes for different surfaces and product contexts." },
                  { value: "2", label: "Platforms", detail: "Shared rules for desktop and mobile." },
                  { value: "4", label: "Product areas", detail: "Home, payments, profile, and chat." },
                ],
              },
            ]).map((section, index) => {
              const media = systemIllustrations[index];
              const isPair = media?.length === 2;

              return {
                ...section,
                media,
                mediaClassName: media
                  ? `case-narrative-media--figma-export${
                      isPair
                        ? " case-narrative-media--figma-pair"
                        : index === 4
                          ? ""
                          : " case-narrative-media--figma-narrow"
                    }${index < 5 ? " case-narrative-media--gap-24" : ""}`
                  : undefined,
              };
            })}
      nextCase={{ href: "#case/zinda-mobile", label: ru ? "Мобильное направление" : "Mobile direction" }}
    />
  );
}
