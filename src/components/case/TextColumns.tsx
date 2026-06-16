import type { ReactNode } from "react";
import { ScrollLineReveal } from "@/components/motion/ScrollLineReveal";

export type TextColumnsProps = {
  /** Заголовок секции (например, «Гайдбук»). */
  title: string;
  /** Колонки текста — каждая колонка это ReactNode (строка или JSX). */
  columns: ReactNode[];
  className?: string;
};

export function TextColumns({ title, columns, className }: TextColumnsProps) {
  return (
    <div
      className={`flex flex-col gap-16 px-[50px] py-[60px] ${className ?? ""}`}
    >
      <h2 className="text-[42px] font-semibold leading-[1.05] tracking-[-0.01em] text-[#263238]">
        {title}
      </h2>

      <div
        className="grid w-full gap-x-16 gap-y-10"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((col, i) => (
          <div
            key={i}
            className="max-w-[480px] text-[18px] leading-[1.5] text-[#263238]"
          >
            {typeof col === "string" ? (
              <ScrollLineReveal as="p">{col}</ScrollLineReveal>
            ) : (
              col
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
