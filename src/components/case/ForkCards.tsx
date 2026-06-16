import type { ReactNode } from "react";
import { ScrollLineReveal } from "@/components/motion/ScrollLineReveal";

export type ForkOption = {
  /** Метка варианта — обычно «A», «B», «C». */
  label: string;
  /** Заголовок варианта (одна фраза). */
  title: string;
  /** Trade-off / комментарий — один-два предложения. */
  note: ReactNode;
  /** true для выбранного варианта — подсвечивается. */
  chosen?: boolean;
};

export type ForkCardsProps = {
  /** Заголовок блока — обычно «Развилка». */
  title: string;
  /** Сама постановка развилки одной фразой. */
  question: ReactNode;
  /** Варианты — обычно 2 или 3. */
  options: ForkOption[];
  /** Вердикт: что выбрали и почему. */
  verdict: ReactNode;
  /** Цена выбора — что мы потеряли. */
  cost?: ReactNode;
  className?: string;
};

export function ForkCards({
  title,
  question,
  options,
  verdict,
  cost,
  className,
}: ForkCardsProps) {
  return (
    <div
      className={`flex flex-col gap-12 px-[50px] py-[60px] ${className ?? ""}`}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-[42px] font-semibold leading-[1.05] tracking-[-0.01em] text-[#263238]">
          {title}
        </h2>
        <p className="max-w-[820px] text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#263238]">
          {question}
        </p>
      </div>

      <div
        className="grid w-full gap-4"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((opt) => (
          <div
            key={opt.label}
            className={`flex flex-col gap-4 rounded-2xl p-7 ${
              opt.chosen
                ? "bg-[#263238] text-white"
                : "bg-[#f5f6f7] text-[#263238]"
            }`}
          >
            <span
              className={`text-[14px] font-semibold ${
                opt.chosen ? "text-white/60" : "text-[#90a4ae]"
              }`}
            >
              Вариант {opt.label}
              {opt.chosen ? " · выбран" : ""}
            </span>
            <p className="text-[18px] font-semibold leading-[1.4]">
              {opt.title}
            </p>
            {typeof opt.note === "string" ? (
              <ScrollLineReveal
                as="p"
                className={`text-[16px] leading-[1.5] ${
                  opt.chosen ? "text-white/75" : "text-[#546e7a]"
                }`}
              >
                {opt.note}
              </ScrollLineReveal>
            ) : (
              <p
                className={`text-[16px] leading-[1.5] ${
                  opt.chosen ? "text-white/75" : "text-[#546e7a]"
                }`}
              >
                {opt.note}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex max-w-[820px] flex-col gap-5 text-[18px] leading-[1.5] text-[#263238]">
        <div>{verdict}</div>
        {cost && <div className="text-[#90a4ae]">{cost}</div>}
      </div>
    </div>
  );
}
