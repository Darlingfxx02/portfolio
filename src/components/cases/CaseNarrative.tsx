import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { CaseImageZoom } from "./CaseImageZoom";

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
  media?: Array<{ src: string; alt: string; caption?: string }>;
  mediaClassName?: string;
};

export function CaseNarrative({
  pageClassName,
  title,
  intro,
  tags,
  hero,
  sections,
  nextCase,
}: {
  pageClassName: string;
  title: string;
  intro: string;
  tags: string[];
  hero: ReactNode;
  sections: NarrativeSection[];
  nextCase?: { href: string; label: string };
}) {
  const { lang } = useLang();
  const ru = lang === "ru";
  const nextCaseProgress = useCaseAdvance(nextCase?.href);

  return (
    <CaseImageZoom className={`case-narrative-page ${pageClassName}`}>
      <main className="case-narrative-main">
        <section className="case-narrative-intro">
          <h1 className="case-narrative-intro__title">{title}</h1>
          <p className="case-narrative-intro__body">{intro}</p>
          <ul className="case-narrative-tags" aria-label={ru ? "Теги кейса" : "Case tags"}>
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </section>

        <div className="case-narrative-hero">{hero}</div>

        {sections.map((section) => (
          <NarrativeSectionView key={`${section.code}-${section.label}`} section={section} />
        ))}

        <footer className="case-narrative-footer">
          <a href="#home">{ru ? "На главную" : "Home"}</a>
          {nextCase && (
            <a
              className="case-narrative-footer__next"
              href={nextCase.href}
              data-pending={nextCaseProgress > 0 || undefined}
              style={
                {
                  "--case-progress": nextCaseProgress,
                } as CSSProperties
              }
            >
              {nextCase.label}
            </a>
          )}
        </footer>
      </main>
    </CaseImageZoom>
  );
}

function useCaseAdvance(nextHref?: string) {
  const [progress, setProgress] = useState(0);
  const lockedRef = useRef(false);

  useEffect(() => {
    if (!nextHref) return;

    let wheelTravel = 0;
    let lastWheelAt = 0;
    let gestureStartedAt = 0;
    let idleTimer: number | null = null;
    let touchStartY: number | null = null;
    let touchStartedAt = 0;

    const atBottom = () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2;

    const clearIdleTimer = () => {
      if (idleTimer !== null) {
        window.clearTimeout(idleTimer);
        idleTimer = null;
      }
    };

    const resetGesture = () => {
      clearIdleTimer();
      wheelTravel = 0;
      lastWheelAt = 0;
      gestureStartedAt = 0;
      touchStartY = null;
      touchStartedAt = 0;
      setProgress(0);
    };

    const scheduleGestureReset = () => {
      clearIdleTimer();
      idleTimer = window.setTimeout(resetGesture, 650);
    };

    const advance = () => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      resetGesture();
      window.location.hash = nextHref;
    };

    const updateWheelProgress = (delta: number, now: number) => {
      if (!gestureStartedAt) gestureStartedAt = now;
      wheelTravel += Math.min(Math.max(delta, 0), 44);

      const distanceProgress = Math.min(wheelTravel / 360, 1);
      const timeProgress = Math.min((now - gestureStartedAt + 80) / 650, 1);
      setProgress(Math.min(distanceProgress, timeProgress));
      scheduleGestureReset();

      if (distanceProgress >= 1 && timeProgress >= 1) advance();
    };

    const onWheel = (event: WheelEvent) => {
      if (lockedRef.current) {
        if (event.deltaY > 0) event.preventDefault();
        return;
      }

      if (event.deltaY <= 0 || !atBottom()) {
        resetGesture();
        return;
      }

      event.preventDefault();
      const now = performance.now();
      if (lastWheelAt && now - lastWheelAt > 650) resetGesture();
      lastWheelAt = now;
      updateWheelProgress(event.deltaY, now);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!atBottom() || lockedRef.current) {
        touchStartY = null;
        return;
      }

      touchStartY = event.touches[0]?.clientY ?? null;
      touchStartedAt = performance.now();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (lockedRef.current) {
        event.preventDefault();
        return;
      }

      if (touchStartY === null || !atBottom()) return;
      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) return;

      const distance = touchStartY - currentY;
      if (distance <= 0) return;

      event.preventDefault();
      const now = performance.now();
      const distanceProgress = Math.min(distance / 240, 1);
      const timeProgress = Math.min((now - touchStartedAt + 60) / 420, 1);
      setProgress(Math.min(distanceProgress, timeProgress));

      if (distanceProgress >= 1 && timeProgress >= 1) advance();
    };

    const onTouchEnd = () => {
      if (!lockedRef.current) resetGesture();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowDown", "PageDown", " "].includes(event.key)) return;
      if (lockedRef.current) {
        event.preventDefault();
        return;
      }
      if (!atBottom()) return;

      event.preventDefault();
      const now = performance.now();
      if (lastWheelAt && now - lastWheelAt > 650) resetGesture();
      lastWheelAt = now;
      updateWheelProgress(52, now);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearIdleTimer();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      lockedRef.current = false;
    };
  }, [nextHref]);

  return progress;
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
          {section.metrics.map((metric, index) => (
            <div
              className="case-narrative-metric"
              data-tone={index % 4}
              key={`${metric.value}-${metric.label}`}
            >
              <div className="case-narrative-metric__pill">
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
              {metric.detail && <p>{metric.detail}</p>}
            </div>
          ))}
        </dl>
      )}

      {section.media && (
        <div className={`case-narrative-media ${section.mediaClassName ?? ""}`}>
          {section.media.map((media) => (
            <figure key={media.src}>
              <img src={media.src} alt={media.alt} loading="lazy" />
              {media.caption && <figcaption>{media.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
