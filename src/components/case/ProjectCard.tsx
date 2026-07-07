import { useLang } from "@/lib/i18n";

type Meta = { label: string; value: string };

export function ProjectCard({
  meta,
  problem,
  solution,
  result,
}: {
  meta: Meta[];
  problem: string;
  solution: string;
  result: string;
}) {
  const ru = useLang().lang === "ru";
  return (
    <div className="rounded-[28px] px-6 py-8 md:px-14 md:py-12">
      <div className="flex flex-wrap gap-x-10 gap-y-7 border-b border-[color:var(--c-border)] pb-9">
        <h2 className="min-w-[220px] flex-1 text-[20px] md:text-[24px] font-semibold leading-[1.15] tracking-[-0.01em] text-[color:var(--c-text)]">
          {ru ? "Карточка проекта" : "Project card"}
        </h2>
        {meta.map((m) => (
          <div key={m.label} className="min-w-[220px] flex-1">
            <p className="text-[12px] font-semibold uppercase tracking-[0.07em] text-[color:var(--c-text-3)]">
              {m.label}
            </p>
            <p className="mt-2 text-[14px] leading-[1.5] text-[color:var(--c-text-2)]">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        <Step n="01" label={ru ? "Проблема" : "Problem"} text={problem} />
        <Step n="02" label={ru ? "Решение" : "Solution"} text={solution} />
        <Step n="03" label={ru ? "Результат" : "Result"} text={result} accent />
      </div>
    </div>
  );
}

function Step({
  n,
  label,
  text,
  accent,
}: {
  n: string;
  label: string;
  text: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className={`text-[15px] font-semibold tabular-nums ${
            accent ? "text-[color:var(--c-warm)]" : "text-[color:var(--c-text-3)]"
          }`}
        >
          {n}
        </span>
        <span
          className={`h-px flex-1 ${accent ? "bg-[var(--c-warm)]/35" : "bg-[var(--c-border)]"}`}
        />
      </div>
      <p className="mt-5 text-[19px] font-semibold leading-[1.2] tracking-[-0.01em] text-[color:var(--c-text)]">
        {label}
      </p>
      <p className="mt-3 text-[15px] leading-[1.6] text-[color:var(--c-text-2)]">{text}</p>
    </div>
  );
}
