import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";

function cn(
  ...values: Array<string | number | false | null | undefined>
) {
  return values.filter(Boolean).join(" ");
}

type ScrollLineRevealProps = {
  children: string;
  as?: ElementType;
  className?: string;
  /** Доля высоты вьюпорта, на которой строка активируется (1.0 = низ, 0 = верх). */
  triggerVh?: number;
  /** Стаггер между словами внутри одной строки (ms на каждый «слот» по X). */
  wordStagger?: number;
  /** Длительность транзишена слова (ms). */
  duration?: number;
};

type WordMeta = { text: string; leadingSpace: string };
type Layout = { lineIdx: number; xInLine: number; docY: number };

export function ScrollLineReveal({
  children,
  as = "p",
  className,
  triggerVh = 0.85,
  wordStagger = 14,
  duration = 340,
}: ScrollLineRevealProps) {
  const Tag = as as ElementType;
  const containerRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [layout, setLayout] = useState<Layout[]>([]);
  /** lineIdx → speedFactor at activation time. 1 = normal speed, >1 = faster reveal. */
  const [activeLines, setActiveLines] = useState<Map<number, number>>(
    () => new Map(),
  );
  const isVisibleRef = useRef(false);
  const measuredRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef<{ y: number; t: number }>({
    y: 0,
    t: 0,
  });
  const speedRef = useRef(0);

  const words = useMemo<WordMeta[]>(() => {
    const out: WordMeta[] = [];
    let pending = "";
    children.split(/(\s+)/).forEach((chunk) => {
      if (/^\s+$/.test(chunk)) {
        pending += chunk;
        return;
      }
      out.push({ text: chunk, leadingSpace: pending });
      pending = "";
    });
    return out;
  }, [children]);

  const wordCount = words.length;

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const positions: { y: number; x: number }[] = [];
      wordRefs.current.forEach((el) => {
        if (!el) {
          positions.push({ y: 0, x: 0 });
          return;
        }
        const r = el.getBoundingClientRect();
        positions.push({
          y: r.top + r.height / 2 + window.scrollY,
          x: r.left,
        });
      });

      const lineYs: number[] = [];
      const wordLineIdx: number[] = positions.map((p) => {
        let idx = lineYs.findIndex((y) => Math.abs(y - p.y) < 4);
        if (idx === -1) {
          idx = lineYs.length;
          lineYs.push(p.y);
        }
        return idx;
      });

      const lineMinX: number[] = [];
      positions.forEach((p, i) => {
        const li = wordLineIdx[i];
        if (lineMinX[li] === undefined || p.x < lineMinX[li]) {
          lineMinX[li] = p.x;
        }
      });

      const newLayout: Layout[] = positions.map((p, i) => ({
        lineIdx: wordLineIdx[i],
        xInLine: p.x - lineMinX[wordLineIdx[i]],
        docY: p.y,
      }));

      measuredRef.current = true;
      setLayout(newLayout);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          isVisibleRef.current = e.isIntersecting;
          if (e.isIntersecting && !measuredRef.current) measure();
          if (e.isIntersecting) requestTick();
        }
      },
      { rootMargin: "300px 0px" },
    );

    const ro = new ResizeObserver(() => {
      if (measuredRef.current) measure();
    });

    const requestTick = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    const update = () => {
      rafRef.current = null;
      if (!isVisibleRef.current || !measuredRef.current) return;

      const now = performance.now();
      const last = lastScrollRef.current;
      const dy = window.scrollY - last.y;
      const dt = Math.max(1, now - last.t);
      // EMA сглаживание скорости (px/ms).
      const inst = Math.abs(dy) / dt;
      speedRef.current = speedRef.current * 0.6 + inst * 0.4;
      lastScrollRef.current = { y: window.scrollY, t: now };

      const vh = window.innerHeight;
      const triggerY = vh * triggerVh;
      setActiveLines((prev) => {
        let next: Map<number, number> | null = null;
        const seen = new Set<number>();
        for (const w of layout) {
          if (seen.has(w.lineIdx) || prev.has(w.lineIdx)) continue;
          seen.add(w.lineIdx);
          const offsetFromTop = w.docY - window.scrollY;
          if (offsetFromTop <= triggerY) {
            // overshoot: насколько слово уже ниже триггера (px вверх от него).
            const overshoot = Math.max(0, triggerY - offsetFromTop);
            // speedFactor: 1 при медленном скролле без overshoot,
            // растёт от скорости (>0.6 px/ms заметно ускоряет) и от overshoot.
            const speedFactor = Math.min(
              12,
              1 +
                Math.max(0, speedRef.current - 0.3) * 6 +
                overshoot / 120,
            );
            if (!next) next = new Map(prev);
            next.set(w.lineIdx, speedFactor);
          }
        }
        return next ?? prev;
      });
    };

    const onScroll = () => {
      if (!isVisibleRef.current) return;
      requestTick();
    };

    lastScrollRef.current = { y: window.scrollY, t: performance.now() };

    if (containerRef.current) {
      io.observe(containerRef.current);
      ro.observe(containerRef.current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [wordCount, triggerVh, layout]);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        containerRef.current = node;
      }}
      className={cn("lr-root", className)}
    >
      {words.map((w, i) => {
        const meta = layout[i];
        const speedFactor = meta
          ? (activeLines.get(meta.lineIdx) ?? 0)
          : 0;
        const active = speedFactor > 0;
        const delay =
          active && meta
            ? Math.round(((meta.xInLine / 14) * wordStagger) / speedFactor)
            : 0;
        // Длительность тоже немного ускоряем (но не сильнее, чем вдвое).
        const dur = active
          ? Math.round(duration / Math.min(2.2, Math.max(1, speedFactor)))
          : duration;
        return (
          <span key={i}>
            {w.leadingSpace}
            <span
              ref={(node) => {
                wordRefs.current[i] = node;
              }}
              className="lr-word"
              data-active={active ? "true" : "false"}
              style={{
                transitionDuration: `${dur}ms`,
                transitionDelay: `${delay}ms`,
              }}
            >
              {w.text}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
