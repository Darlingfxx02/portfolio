import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { socials } from "@/data/footer";
import { profile } from "@/data/profile";
import { useLang } from "@/lib/i18n";

export type SnapshotItem = {
  label: string;
  value: string;
};

export type CaseFrameworkStep = {
  code: string;
  label: string;
  value: string;
};

export type CaseMediumSection = {
  label: string;
  title: string;
  body: string;
};

export function CaseHeroBlock({
  title,
  intro,
  tags,
}: {
  title: string;
  intro: string;
  tags: string[];
}) {
  return (
    <section className="case-editorial-hero">
      <h1 className="case-editorial-title">{title}</h1>
      <div className="case-editorial-hero__body">
        <p className="case-editorial-intro">{intro}</p>
        <TagList tags={tags} />
      </div>
    </section>
  );
}

export function ProjectSnapshot({
  meta,
  problem,
  solution,
  result,
}: {
  meta: SnapshotItem[];
  problem: string;
  solution: string;
  result: string;
}) {
  const ru = useLang().lang === "ru";
  return (
    <div className="case-snapshot">
      <div className="case-snapshot__meta">
        {meta.map((item) => (
          <FactCell key={item.label} item={item} />
        ))}
      </div>
      <div className="case-snapshot__story">
        <SnapshotStep
          n="01"
          label={ru ? "Проблема" : "Problem"}
          value={problem}
        />
        <SnapshotStep
          n="02"
          label={ru ? "Решение" : "Solution"}
          value={solution}
        />
        <SnapshotStep
          n="03"
          label={ru ? "Результат" : "Result"}
          value={result}
        />
      </div>
    </div>
  );
}

/**
 * Short STAR+Product layer for the first scan of a case.
 * The long-form sections below can carry the evidence; this block makes the
 * narrative legible before a hiring manager commits to the full read.
 */
export function CaseFramework({
  steps,
}: {
  meta: SnapshotItem[];
  steps: CaseFrameworkStep[];
}) {
  const scanSteps = steps.filter((step) => ["S", "A", "R"].includes(step.code));
  return (
    <div className="case-framework" aria-label="Case summary">
      <div className="case-framework__steps">
        {scanSteps.map((step) => (
          <div className="case-framework__step" key={step.code}>
            <p className="case-framework__label">
              <span className="tabular-nums">{step.code}</span>
              <span aria-hidden> / </span>
              {step.label}
            </p>
            <p className="case-framework__value">{step.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CaseMedium({ sections }: { sections: CaseMediumSection[] }) {
  return (
    <section className="case-medium" aria-label="Case overview">
      {sections.map((section) => (
        <article className="case-medium__section" key={section.label}>
          <p className="case-medium__label">{section.label}</p>
          <h2 className="case-medium__title">{section.title}</h2>
          <p className="case-medium__body">{section.body}</p>
        </article>
      ))}
    </section>
  );
}

export function CaseCTA() {
  const ru = useLang().lang === "ru";

  return (
    <section className="case-editorial-footer">
      <div className="case-editorial-footer__intro">
        <div>
          <p className="case-editorial-footer__eyebrow">
            {ru ? "Следующий шаг" : "Next step"}
          </p>
          <h2 className="case-editorial-footer__title">
            {ru
              ? "Есть похожая развилка, которую нужно довести до решения?"
              : "Have a similar messy fork that needs turning into a decision?"}
          </h2>
          <p className="case-editorial-footer__copy">
            {ru
              ? "Я полезен там, где продукт упирается в ограничения: регуляторика, handoff, AI-прототипы и сложные B2B-сценарии."
              : "I am useful where product work runs into constraints: regulation, handoff, AI prototypes, and complex B2B flows."}
          </p>
        </div>

        <div className="case-editorial-footer__contact">
          <p className="case-editorial-footer__eyebrow">
            {ru ? "Связаться" : "Contact"}
          </p>
          <div className="case-editorial-footer__links">
            {socials.map(({ label, href, Icon }) => (
              <ContactLink
                key={href}
                label={label === "Email" ? (ru ? "Почта" : "Email") : ru ? "Телеграм" : "Telegram"}
                href={href}
                icon={<Icon size={20} weight="bold" />}
                external={href.startsWith("http")}
              >
                {label === "Email" ? profile.email : profile.telegramHandle}
              </ContactLink>
            ))}
          </div>
          <p className="case-editorial-footer__note">
            {ru
              ? "В Telegram обычно отвечаю быстрее, почта удобнее для брифа и материалов."
              : "Telegram is usually faster, email works best for briefs and materials."}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[14px] font-semibold leading-none text-[color:var(--c-text-3)]">
      {children}
    </p>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="case-editorial-meta" aria-label="Project metadata">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

function FactCell({ item }: { item: SnapshotItem }) {
  return (
    <div className="case-snapshot__cell">
      <p className="case-snapshot__label">{item.label}</p>
      <p className="case-snapshot__value">{item.value}</p>
    </div>
  );
}

function SnapshotStep({
  n,
  label,
  value,
}: {
  n: string;
  label: string;
  value: string;
}) {
  return (
    <div className="case-snapshot__cell case-snapshot__cell--story">
      <p className="case-snapshot__label">
        <span className="tabular-nums">{n}</span>
        <span aria-hidden> / </span>
        {label}
      </p>
      <p className="case-snapshot__value">{value}</p>
    </div>
  );
}

function ContactLink({
  label,
  href,
  icon,
  external,
  children,
}: {
  label: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="case-editorial-contact-link group"
    >
      <span className="case-editorial-contact-link__icon">{icon}</span>
      <span className="case-editorial-contact-link__content">
        <span className="case-editorial-contact-link__label">{label}</span>
        <span className="case-editorial-contact-link__value">{children}</span>
      </span>
      <ArrowUpRight
        size={18}
        weight="bold"
        className="case-editorial-contact-link__arrow"
      />
    </a>
  );
}
