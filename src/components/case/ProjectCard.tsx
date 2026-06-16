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
  return (
    <div className="rounded-[28px] px-14 py-12">
      <div className="flex flex-wrap gap-x-10 gap-y-7 border-b border-[#eceff1] pb-9">
        <h2 className="min-w-[220px] flex-1 text-[24px] font-semibold leading-[1.15] tracking-[-0.01em] text-[#263238]">
          Карточка проекта
        </h2>
        {meta.map((m) => (
          <div key={m.label} className="min-w-[220px] flex-1">
            <p className="text-[12px] font-semibold uppercase tracking-[0.07em] text-[#90a4ae]">
              {m.label}
            </p>
            <p className="mt-2 text-[14px] leading-[1.5] text-[#546e7a]">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-9 grid grid-cols-3 gap-10">
        <Step n="01" label="Проблема" text={problem} />
        <Step n="02" label="Решение" text={solution} />
        <Step n="03" label="Результат" text={result} accent />
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
            accent ? "text-[#b3380a]" : "text-[#90a4ae]"
          }`}
        >
          {n}
        </span>
        <span
          className={`h-px flex-1 ${accent ? "bg-[#b3380a]/35" : "bg-[#e1e5e8]"}`}
        />
      </div>
      <p className="mt-5 text-[19px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#263238]">
        {label}
      </p>
      <p className="mt-3 text-[15px] leading-[1.6] text-[#546e7a]">{text}</p>
    </div>
  );
}
