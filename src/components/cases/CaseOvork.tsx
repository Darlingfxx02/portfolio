import { useLang } from "@/lib/i18n";
import { CaseNarrative } from "./CaseNarrative";

export function CaseOvork() {
  const ru = useLang().lang === "ru";

  return (
    <CaseNarrative
      pageClassName="ovork-page"
      title={
        ru
          ? "Финансовый цикл"
          : "Full financial cycle"
      }
      intro={
        ru
          ? "Мы перенесли путь от завершённой смены до получения денег внутрь приложения: спроектировали кошелёк, прозрачные начисления, удержания, выплаты и юридически значимые уведомления — в рамках требований ФНС."
          : "We moved the journey from a completed shift to receiving money into the app: a wallet, transparent accruals, deductions, payouts, and legally significant notifications — all within Russian tax requirements."
      }
      tags={
        ru
          ? ["Продуктовый дизайн", "Финтех · мобильное приложение", "Регуляторный UX", "2025–2026"]
          : ["Senior Product Design", "Fintech · Mobile", "Regulatory UX", "2025–2026"]
      }
      hero={
        <div className="case-narrative-hero--phones">
          <img src="/ovork/hero-1.webp" alt={ru ? "Главный экран ОВорк" : "OVork home screen"} />
          <img src="/ovork/hero-2.webp" alt={ru ? "Кошелёк ОВорк" : "OVork wallet"} />
          <img src="/ovork/hero-3.webp" alt={ru ? "Финансовое уведомление ОВорк" : "OVork financial notification"} />
        </div>
      }
      sections={
        ru
          ? [
              {
                code: "S",
                label: "Ситуация",
                body: "Изначально ОВорк помогал работодателям находить специалистов на смены и управлять выходами. После завершения работы финансовый сценарий уходил за пределы продукта: исполнителю было сложно понять, когда начислены деньги, почему часть суммы удержана и что произойдёт дальше.",
                support: [
                  {
                    title: "Почему это стало продуктовой проблемой",
                    body: "Ценность приложения заканчивалась вместе со сменой. Непрозрачность выплат снижала доверие, провоцировала споры и переводила вопросы о деньгах в поддержку.",
                  },
                  {
                    title: "Главное ограничение",
                    body: "Финансовый опыт определялся не только пользовательскими потребностями. Практически каждое решение проходило юридическую проверку, а ответы по требованиям ФНС приходили с задержкой и иногда противоречили предыдущим трактовкам.",
                  },
                ],
              },
              {
                code: "T",
                label: "Задача",
                body: "Нужно было превратить ОВорк из дашборда для управления сменами в платформу, сопровождающую исполнителя до полного финансового расчёта, и встроить новый слой в существующий продукт без разрушения ключевых сценариев.",
                bullets: [
                  "Создать единый кошелёк с балансом, начислениями и выплатами.",
                  "Объяснить удержания, корректировки и издержки при невыходе специалиста на смену.",
                  "Сделать каждую финансовую операцию отслеживаемой.",
                  "Выполнить требования ФНС, сохранив понятную навигацию и визуальную иерархию.",
                ],
              },
              {
                code: "A1",
                label: "Продуктовая модель",
                body: "Главным изменением стал не новый раздел, а новый конец пользовательского пути. Раньше сценарий выглядел как «нашёл смену → отработал → покинул приложение». После внедрения финансового слоя продукт сопровождал пользователя до начисления, проверки и вывода денег.",
                support: [
                  {
                    title: "Кошелёк как финансовый центр",
                    body: "Я собрал баланс, историю операций и статусы смен в одном предсказуемом месте. Любая сумма получила происхождение, текущее состояние и следующее доступное действие.",
                  },
                ],
                media: [
                  { src: "/ovork/balance-1.webp", alt: "Главный экран кошелька ОВорк" },
                  { src: "/ovork/balance-2.webp", alt: "Детализация баланса ОВорк" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A2",
                label: "Прозрачность денег",
                body: "Вместо одной итоговой цифры мы показали маршрут денег. Пользователь видит доступную сумму, средства в обработке, удержания и задолженность, а каждая операция связана с конкретной сменой и объяснением причины.",
                bullets: [
                  "Начисления и выплаты с понятным статусом.",
                  "Удержания и корректировки с причиной, а не только отрицательной суммой.",
                  "Издержки при невыходе на смену как отдельный объяснимый сценарий.",
                  "Единая история, по которой можно восстановить весь финансовый путь.",
                ],
                media: [
                  { src: "/ovork/balance-3.webp", alt: "Состояния финансовых операций ОВорк" },
                  { src: "/ovork/annul-1.webp", alt: "Сценарий удержания в ОВорк" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A3",
                label: "Регуляторные компромиссы",
                body: "Не все решения были желательны с точки зрения чистоты интерфейса. По требованию ФНС уведомления пришлось перенести из профиля на главный экран, а баннер задолженности — показывать во всех ключевых разделах. Вместо борьбы с неизбежным требованием я работал с его формой и уровнем трения.",
                support: [
                  {
                    title: "Уведомления за один тап",
                    body: "Иконка с badge появилась в шапке главного экрана. Это сохранило компактную навигацию и одновременно сделало юридически значимые события заметнее.",
                  },
                  {
                    title: "Постоянный, но не блокирующий долг",
                    body: "Баннер задолженности всегда оставался видимым, но не превращался в модальный барьер. Пользователь мог продолжить основной сценарий и при необходимости сразу перейти к погашению.",
                  },
                ],
                media: [
                  { src: "/ovork/main-2.webp", alt: "Главный экран ОВорк с требованиями ФНС" },
                  { src: "/ovork/main-3.webp", alt: "Баннер задолженности в ОВорк" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A4",
                label: "Система уведомлений",
                body: "Каждый финансовый триггер получил собственный сценарий информирования: поступление, списание, удержание, корректировка и изменение статуса платежа. Универсальный компонент позволил сохранять единую структуру сообщения и масштабировать её на новые события.",
                media: [
                  { src: "/ovork/notif-1.webp", alt: "Система уведомлений ОВорк" },
                  { src: "/ovork/notif-3.webp", alt: "Финансовые уведомления ОВорк" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A5",
                label: "Релиз",
                body: "В разработку передавались не только финальные экраны, но и полное поведение сценариев: empty, loading, error и disabled states, контентные ограничения, sticky-поведение баннера и acceptance notes для краевых случаев. Это позволяло выпускать финансовый слой небольшими частями и не замедлять живой продукт.",
                bullets: [
                  "Декомпозиция большого финансового контура на release-ready сценарии.",
                  "Регулярная сверка с продуктом, разработкой и legal.",
                  "Единые состояния для кошелька, уведомлений и спорных операций.",
                ],
              },
              {
                code: "R",
                label: "Результат",
                body: "ОВорк стал закрывать полный путь исполнителя — от поиска смены до получения оплаты. Пользователь получил единый центр финансов, а бизнес — основу для дальнейших платёжных сервисов и меньшую операционную нагрузку вокруг спорных выплат.",
                metrics: [
                  { value: "100%", label: "Прозрачность", detail: "ключевые финансовые операции получили статус" },
                  { value: "−30%", label: "Вопросы о выплатах", detail: "оценка снижения обращений в поддержку" },
                  { value: "+20%", label: "Возврат после смены", detail: "оценка роста возвращаемости после смены" },
                  { value: "−45%", label: "Поиск статуса", detail: "оценка времени на понимание выплаты" },
                ],
                media: [
                  { src: "/ovork/notif-4.webp", alt: "Финальная система финансовых уведомлений ОВорк" },
                  { src: "/ovork/annul-3.webp", alt: "Финальный сценарий удержания ОВорк" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "+",
                label: "Выводы",
                body: "Этот проект закрепил для меня простую мысль: хороший финансовый UX часто незаметен. Пользователь не должен разбираться во внутренней расчётной логике — он должен понимать, где находятся его деньги, почему сумма изменилась и что произойдёт дальше. Регуляторные ограничения нельзя убрать, но можно спроектировать их скорость, заметность и степень трения.",
              },
            ]
          : [
              {
                code: "S",
                label: "Situation",
                body: "OVork originally helped employers find specialists for shifts and manage attendance. Once work ended, the financial journey left the product: workers struggled to understand when money was accrued, why part of it was held, and what would happen next.",
                support: [
                  {
                    title: "Why this became a product problem",
                    body: "The app’s value ended with the shift. Opaque payouts reduced trust, triggered disputes, and pushed money questions into support.",
                  },
                  {
                    title: "The main constraint",
                    body: "The financial experience was not shaped by user needs alone. Almost every decision required legal review, while guidance around tax requirements arrived slowly and sometimes contradicted earlier interpretations.",
                  },
                ],
              },
              {
                code: "T",
                label: "Task",
                body: "Turn OVork from a shift-management dashboard into a platform that follows a worker through the full financial settlement, while fitting the new layer into a live product without breaking its core journeys.",
                bullets: [
                  "Create one wallet for balances, accruals, and payouts.",
                  "Explain deductions, adjustments, and no-show costs.",
                  "Make every financial operation traceable.",
                  "Meet tax requirements while preserving clear navigation and hierarchy.",
                ],
              },
              {
                code: "A1",
                label: "Product model",
                body: "The main change was not a new section but a new ending to the user journey. Before, it was “find a shift → work → leave the app.” With the financial layer, the product followed the user through accrual, verification, and withdrawal.",
                support: [
                  {
                    title: "Wallet as a financial center",
                    body: "I brought the balance, transaction history, and shift statuses into one predictable place. Every amount received an origin, a current state, and a next available action.",
                  },
                ],
                media: [
                  { src: "/ovork/balance-1.webp", alt: "OVork wallet home" },
                  { src: "/ovork/balance-2.webp", alt: "OVork balance details" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A2",
                label: "Money transparency",
                body: "Instead of one total, we showed the route of money. Users could see what was available, processing, held, or owed, with every operation tied to a specific shift and an explanation.",
                bullets: [
                  "Accruals and payouts with explicit statuses.",
                  "Deductions and adjustments with reasons, not just negative amounts.",
                  "No-show costs as a distinct, explainable journey.",
                  "A single history reconstructing the entire financial path.",
                ],
                media: [
                  { src: "/ovork/balance-3.webp", alt: "OVork transaction states" },
                  { src: "/ovork/annul-1.webp", alt: "OVork deduction flow" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A3",
                label: "Regulatory trade-offs",
                body: "Not every decision improved visual simplicity. Tax requirements forced notifications out of the profile and onto the home screen, while a debt banner had to appear across key sections. Rather than fighting an unavoidable requirement, I shaped its form and level of friction.",
                support: [
                  {
                    title: "Notifications in one tap",
                    body: "A badged icon moved into the home header. It kept navigation compact while making legally significant events more visible.",
                  },
                  {
                    title: "Persistent, not blocking",
                    body: "The debt banner remained visible without turning into a modal wall. Users could keep working or move directly to settlement when ready.",
                  },
                ],
                media: [
                  { src: "/ovork/main-2.webp", alt: "OVork home with tax requirements" },
                  { src: "/ovork/main-3.webp", alt: "OVork debt banner" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A4",
                label: "Notification system",
                body: "Every financial trigger received its own communication flow: income, write-off, deduction, adjustment, and payment-status change. A reusable component kept messages consistent and scaled to future events.",
                media: [
                  { src: "/ovork/notif-1.webp", alt: "OVork notification system" },
                  { src: "/ovork/notif-3.webp", alt: "OVork financial notifications" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "A5",
                label: "Release",
                body: "Engineering received more than polished screens: empty, loading, error, and disabled states; content limits; sticky-banner behavior; and acceptance notes for edge cases. This let us ship the financial layer in small slices without slowing the live product.",
                bullets: [
                  "Decomposed the financial system into release-ready journeys.",
                  "Kept product, engineering, and legal in a recurring review loop.",
                  "Standardized states across wallet, notifications, and disputed operations.",
                ],
              },
              {
                code: "R",
                label: "Result",
                body: "OVork began covering the full worker journey, from finding a shift to receiving payment. Users gained one financial center, while the business gained a foundation for future payment services and less operational load around payout disputes.",
                metrics: [
                  { value: "100%", label: "Transparency", detail: "core financial operations gained a status" },
                  { value: "−30%", label: "Payout questions", detail: "estimated reduction in support contacts" },
                  { value: "+20%", label: "Post-shift return", detail: "estimated retention increase" },
                  { value: "−45%", label: "Status lookup", detail: "estimated time to understand a payout" },
                ],
                media: [
                  { src: "/ovork/notif-4.webp", alt: "Final OVork financial notification system" },
                  { src: "/ovork/annul-3.webp", alt: "Final OVork deduction journey" },
                ],
                mediaClassName: "case-narrative-media--split",
              },
              {
                code: "+",
                label: "Reflection",
                body: "This project reinforced a simple idea: good financial UX is often invisible. Users should not have to understand internal settlement logic — they should know where their money is, why an amount changed, and what happens next. Regulation cannot be removed, but its speed, visibility, and friction can be designed.",
              },
            ]
      }
      nextCase={{ href: "#case/uxart", label: "UXART" }}
    />
  );
}
