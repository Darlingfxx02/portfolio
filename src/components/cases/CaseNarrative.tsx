import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n";

export type NarrativeSupport = {
  title: string;
  body: string;
};

export type NarrativeMetric = {
  value: string;
  label: string;
  detail?: string;
};

export type NarrativeSection = {
  code: string;
  label: string;
  body: string;
  bullets?: string[];
  support?: NarrativeSupport[];
  metrics?: NarrativeMetric[];
  note?: string;
  media?: Array<{ src: string; alt: string }>;
  mediaClassName?: string;
};

export function CaseNarrative({
  pageClassName,
  brand,
  title,
  intro,
  tags,
  hero,
  sections,
  nextCase,
}: {
  pageClassName: string;
  brand: string;
  title: string;
  intro: string;
  tags: string[];
  hero: ReactNode;
  sections: NarrativeSection[];
  nextCase?: { href: string; label: string };
}) {
  const ru = useLang().lang === "ru";

  return (
    <div className={`case-narrative-page ${pageClassName}`}>
      <header className="case-narrative-topbar">
        <a href="#top" className="case-narrative-topbar__back">
          ← <span>{ru ? "Назад" : "Back"}</span>
        </a>
        <a href="#top" className="case-narrative-topbar__name">
          {brand}
        </a>
      </header>

      <main className="case-narrative-main">
        <section className="case-narrative-intro">
          <h1 className="case-narrative-intro__title">{title}</h1>
          <div className="case-narrative-intro__body">
            <p>{intro}</p>
            <ul className="case-narrative-tags" aria-label={ru ? "Теги кейса" : "Case tags"}>
              {tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="case-narrative-hero">{hero}</div>

        {sections.map((section) => (
          <NarrativeSectionView key={`${section.code}-${section.label}`} section={section} />
        ))}

        <footer className="case-narrative-footer">
          <a href="#top">{ru ? "На главную" : "Home"}</a>
          {nextCase && <a href={nextCase.href}>{nextCase.label}</a>}
        </footer>
      </main>
    </div>
  );
}

function NarrativeSectionView({ section }: { section: NarrativeSection }) {
  return (
    <section className="case-narrative-section">
      <h2>
        {section.code} <span>({section.label})</span>
      </h2>
      <p className="case-narrative-section__body">{section.body}</p>

      {section.bullets && (
        <ul className="case-narrative-list">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}

      {section.support?.map((item) => (
        <div className="case-narrative-support" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      ))}

      {section.metrics && (
        <dl className="case-narrative-metrics">
          {section.metrics.map((metric) => (
            <div className="case-narrative-metric" key={`${metric.value}-${metric.label}`}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
              {metric.detail && <p>{metric.detail}</p>}
            </div>
          ))}
        </dl>
      )}

      {section.note && <p className="case-narrative-note">{section.note}</p>}

      {section.media && (
        <div className={`case-narrative-media ${section.mediaClassName ?? ""}`}>
          {section.media.map((media) => (
            <figure key={media.src}>
              <img src={media.src} alt={media.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
