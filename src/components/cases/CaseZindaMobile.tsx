import { CaseNarrative } from "./CaseNarrative";
import { useLang } from "@/lib/i18n";

const mobileIllustrations = [
  [
    { src: "/zinda/payments-desktop-list.png", alt: "Шаблоны платежей в веб-версии" },
    { src: "/zinda/mobile-templates-clean.png", alt: "Шаблоны платежей в мобильной версии" },
  ],
  [
    { src: "/zinda/mobile-history-shadow.png", alt: "История операций как последовательный мобильный список" },
    { src: "/zinda/mobile-payment-success.png", alt: "Результат платежа как отдельное мобильное состояние" },
  ],
  [
    { src: "/zinda/mobile-payments-form.png", alt: "Мобильная точка входа в счета и платежи" },
    { src: "/zinda/mobile-exchange.png", alt: "Мобильный сценарий обмена валют" },
  ],
  [
    { src: "/zinda/mobile-profile-documents.png", alt: "Документы компании в мобильной версии" },
    { src: "/zinda/mobile-profile-roles.png", alt: "Управление ролями сотрудников в мобильной версии" },
  ],
  [
    { src: "/zinda/mobile-chat-home.png", alt: "Главная мобильного чата" },
    { src: "/zinda/mobile-chat-files.png", alt: "Мобильный чат с отправленными файлами" },
  ],
  [
    { src: "/zinda/process-tasks-focus.jpg", alt: "Планирование мобильного направления и аудит нагрузки" },
    { src: "/zinda/process-brief-focus.jpg", alt: "Требования для самостоятельной передачи в разработку" },
  ],
  [
    { src: "/zinda/mobile-home-shadow.png", alt: "Базовая ветка главной страницы мобильного банка" },
    { src: "/zinda/mobile-company-info.png", alt: "Концептуальная ветка приложения, не представленная как реализация" },
  ],
];

export function CaseZindaMobile() {
  const { lang } = useLang();
  const ru = lang === "ru";

  return (
    <CaseNarrative
      pageClassName="zinda-page zinda-mobile-page"
      title={
        ru
          ? "Zinda. Мобильное приложение — первое направление, которое я вёл самостоятельно"
          : "Zinda Mobile. The first direction I led independently"
      }
      intro={
        ru
          ? "К началу мобильного этапа я уже знал банк как целую систему: главную, платежи, профили, чат и компонентные правила. Это позволило мне перейти от производства экранов к самостоятельному ведению — самому определять приоритеты и пересобирать веб-логику под короткие мобильные сессии."
          : "By the mobile phase, I understood the bank as a complete system: home, payments, profiles, chat, and component rules. That let me move from screen production to ownership — setting priorities and rebuilding desktop logic for short mobile sessions."
      }
      tags={
        ru
          ? ["Ответственность за направление", "Финтех · Мобильное приложение", "Веб → Мобильное приложение", "2024"]
          : ["Direction Ownership", "Fintech · Mobile", "Desktop → Mobile", "2024"]
      }
      hero={
        <div className="case-narrative-hero--split case-narrative-hero--comparison">
          <img
            src="/zinda/focus-main-desktop.png"
            alt={ru ? "Главная Zinda в веб-версии" : "Zinda home on desktop"}
          />
          <img
            src="/zinda/focus-main-mobile.png"
            alt={ru ? "Главная Zinda в мобильной версии" : "Zinda home on mobile"}
          />
        </div>
      }
      sections={(ru
          ? [
              {
                code: "01",
                label: "Не уменьшенная веб-версия",
                body: "Веб-версия помогала держать много информации перед глазами; мобильная должна была быстро довести пользователя до одного решения. Простое уменьшение таблиц и панелей сделало бы банк медленным и перегруженным, поэтому каждый сценарий пришлось заново расставить по приоритетам.",
                metrics: [
                  { value: "4", label: "Ключевых сценария", detail: "Главная, платежи, профиль и чат." },
                  { value: "5", label: "Правил адаптации", detail: "Единая логика переноса веб-сценариев на мобильные устройства." },
                  { value: "2", label: "Платформы", detail: "Одна бизнес-логика для веба и мобильного приложения." },
                  { value: "1", label: "Направление", detail: "Самостоятельное ведение от аудита до передачи в разработку." },
                ],
              },
              {
                code: "02",
                label: "Правила переноса",
                body: "Я сохранял бизнес-логику, но менял способ её предъявления. Боковая навигация становилась нижней, боковая панель — нижней панелью или полноэкранным слоем, таблица — последовательностью карточек, а параллельная работа с данными — пошаговым сценарием.",
                bullets: [
                  "Боковая навигация → нижняя навигация.",
                  "Боковая панель → нижняя панель или полноэкранный слой.",
                  "Много колонок → последовательное раскрытие.",
                  "Таблица → список карточек.",
                  "Наведение и подсказка → явное действие.",
                ],
              },
              {
                code: "03",
                label: "Платежи",
                body: "В платежах особенно важно было не потерять контекст: шаблоны, историю, реквизиты и подтверждения нельзя было просто сложить в длинную мобильную страницу. Поток разделили на короткие состояния с одним главным действием.",
                media: [
                  { src: "/zinda/mobile-payments-form.png", alt: "Мобильный платёжный сценарий Zinda" },
                ],
                mediaClassName: "case-narrative-media--phone",
              },
              {
                code: "04",
                label: "Профиль и доступы",
                body: "Управление компанией, сотрудниками, документами и ролями в веб-версии использовало большую рабочую область. В мобильной версии административные задачи раскладывались по шагам, а вторичная информация раскрывалась только в нужном контексте.",
              },
              {
                code: "05",
                label: "Чат",
                body: "Чат стал отдельной мобильной средой со своими пустыми состояниями, вложениями, системными сообщениями и действиями. Тёмная тема требовала сохранить читаемость длинных диалогов и заметность банковских статусов.",
              },
              {
                code: "06",
                label: "Самостоятельное ведение",
                body: "Это был не просто новый набор макетов. Я самостоятельно проверял веб-сценарии, определял информационную архитектуру мобильной версии, собирал прототипы, синхронизировал решения с общей логикой банка и готовил спецификации для разработки.",
                support: [
                  {
                    title: "Что изменилось в моей роли",
                    body: "Раньше я отвечал за качество порученного сценария. Здесь я отвечал за то, какие сценарии попадут в направление, как они будут связаны и что команда получит при передаче в разработку.",
                  },
                ],
              },
              {
                code: "+",
                label: "Статус и вывод",
                body: "В исходном Figma-файле часть мобильных веток помечена как концепт, не согласовано или устаревшая версия. В публичной версии я разделяю эти статусы и не выдаю исследовательские ветки за реализованный продукт. Главный результат кейса — переход к самостоятельному ведению сложного продуктового направления.",
                metrics: [
                  { value: "4", label: "Ключевых сценария", detail: "Главная, платежи, профиль и чат." },
                  { value: "5", label: "Правил адаптации", detail: "Повторяемый способ переводить веб-паттерны в мобильные." },
                  { value: "2", label: "Платформы", detail: "Общая бизнес-логика для веба и мобильного приложения." },
                  { value: "1", label: "Направление", detail: "Самостоятельное ведение от аудита веб-сценариев до спецификаций." },
                ],
              },
            ]
          : [
              {
                code: "01",
                label: "Not a responsive version",
                body: "Desktop kept a large amount of information visible at once; mobile needed to move the user toward one decision quickly. Simply shrinking tables and panels would have made the bank slow and overloaded, so every journey needed new priorities.",
                metrics: [
                  { value: "4", label: "Core journeys", detail: "Home, payments, profile, and chat." },
                  { value: "5", label: "Adaptation rules", detail: "One approach for translating desktop behavior to mobile." },
                  { value: "2", label: "Platforms", detail: "One business logic across desktop and mobile." },
                  { value: "1", label: "Direction", detail: "Independent ownership from audit to engineering handoff." },
                ],
              },
              {
                code: "02",
                label: "Translation rules",
                body: "I preserved business logic while changing its presentation. Side navigation became bottom navigation, drawers became bottom sheets or full-screen layers, tables became card sequences, and parallel data work became a step-by-step flow.",
                bullets: [
                  "Side navigation → bottom navigation.",
                  "Drawer → bottom sheet / full-screen layer.",
                  "Multiple columns → progressive disclosure.",
                  "Table → card list.",
                  "Hover and tooltip → explicit action.",
                ],
              },
              {
                code: "03",
                label: "Payments",
                body: "Payments had to preserve context across templates, history, account details, and confirmations. Rather than stacking them into one long mobile page, the journey was separated into focused states with a single primary action.",
                media: [
                  { src: "/zinda/mobile-payments-form.png", alt: "A Zinda mobile payment flow" },
                ],
                mediaClassName: "case-narrative-media--phone",
              },
              {
                code: "04",
                label: "Profile and access",
                body: "Company, employee, document, and role management relied on a large desktop workspace. On mobile, administrative tasks became sequential, while secondary information appeared only in the relevant context.",
              },
              {
                code: "05",
                label: "Chat",
                body: "Chat became a dedicated mobile environment with empty states, attachments, system messages, and actions. The dark theme needed to keep long conversations readable and banking statuses visible.",
              },
              {
                code: "06",
                label: "Ownership",
                body: "This was more than a new set of mockups. I independently audited desktop journeys, defined the mobile IA, built prototypes, aligned decisions with the bank's overall logic, and prepared specifications for engineering.",
                support: [
                  {
                    title: "How my role changed",
                    body: "Previously I owned the quality of an assigned journey. Here I owned which journeys entered the direction, how they connected, and what the team received at handoff.",
                  },
                ],
              },
              {
                code: "+",
                label: "Status and takeaway",
                body: "Some mobile branches in the source Figma file are labeled concept, not approved, or legacy. The public case separates these statuses instead of presenting exploratory work as production. Its core outcome is my transition to independently leading a complex product direction.",
                metrics: [
                  { value: "4", label: "Core journeys", detail: "Home, payments, profile, and chat." },
                  { value: "5", label: "Adaptation rules", detail: "A repeatable way to translate desktop patterns to mobile." },
                  { value: "2", label: "Platforms", detail: "One business logic across desktop and mobile." },
                  { value: "1", label: "Direction", detail: "Independent ownership from desktop-flow audit to specifications." },
                ],
              },
            ]).map((section, index) => ({
              ...section,
              media: mobileIllustrations[index].map((media, mediaIndex) =>
                index === 6
                  ? {
                      ...media,
                      caption: ru
                        ? mediaIndex === 0
                          ? "Главная · базовая ветка"
                          : "Концепт приложения · исследовательская ветка"
                        : mediaIndex === 0
                          ? "Home · baseline"
                          : "App concept · exploratory branch",
                    }
                  : media,
              ),
              mediaClassName:
                index === 5
                  ? "case-narrative-media--compact"
                  : `case-narrative-media--compact case-narrative-media--mobile-showcase${
                      index === 0 ? " case-narrative-media--mobile-comparison" : ""
                    }`,
            }))}
      nextCase={{ href: "#case/uxart", label: "UXART" }}
    />
  );
}
