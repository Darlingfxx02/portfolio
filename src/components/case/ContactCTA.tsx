import type { ReactNode } from "react";

export type ContactItem = {
  label: string;
  value: string;
  href?: string;
};

export type ContactCTAProps = {
  /** Большой заголовок. Например, «Готовы обсудить наше сотрудничество». */
  title: ReactNode;
  /** Список контактов — каждый рендерится в свою колонку. */
  contacts: ContactItem[];
  /** Опциональный фон/изображение справа. */
  visual?: ReactNode;
  className?: string;
};

export function ContactCTA({
  title,
  contacts,
  visual,
  className,
}: ContactCTAProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl bg-[#1f2628] p-[60px] text-white ${className ?? ""}`}
    >
      <div className="relative z-10 flex max-w-[823px] flex-col gap-12">
        <h2 className="text-[42px] font-semibold leading-[1.1] tracking-[-0.01em]">
          {title}
        </h2>

        <div className="flex flex-wrap gap-x-[120px] gap-y-8">
          {contacts.map((c) => (
            <div key={c.label} className="flex flex-col gap-2">
              <span className="text-[14px] font-semibold text-white/60">
                {c.label}
              </span>
              {c.href ? (
                <a
                  href={c.href}
                  className="text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-white hover:underline"
                >
                  {c.value}
                </a>
              ) : (
                <span className="text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-white">
                  {c.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {visual && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0">
          {visual}
        </div>
      )}
    </div>
  );
}
