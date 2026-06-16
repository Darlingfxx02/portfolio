import type { ReactNode } from "react";
import { ScrollLineReveal } from "@/components/motion/ScrollLineReveal";

export type TestimonialProps = {
  /** Заголовок секции — обычно «Отзыв о работе». */
  title?: string;
  /** Текст отзыва / цитата. */
  quote: ReactNode;
  /** Имя автора. */
  author: string;
  /** Должность / роль автора. */
  role?: string;
  /** Аватар (URL или JSX). */
  avatar?: ReactNode;
  className?: string;
};

export function Testimonial({
  title = "Отзыв о работе",
  quote,
  author,
  role,
  avatar,
  className,
}: TestimonialProps) {
  return (
    <div
      className={`flex w-full flex-col gap-12 px-[50px] py-[60px] ${className ?? ""}`}
    >
      <h2 className="text-[42px] font-semibold leading-[1.05] tracking-[-0.01em] text-[#263238]">
        {title}
      </h2>

      {typeof quote === "string" ? (
        <ScrollLineReveal
          as="p"
          className="max-w-[625px] text-[18px] leading-[1.5] text-[#263238]"
        >
          {quote}
        </ScrollLineReveal>
      ) : (
        <p className="max-w-[625px] text-[18px] leading-[1.5] text-[#263238]">
          {quote}
        </p>
      )}

      <div className="flex items-center gap-5">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#cfd8dc]">
          {avatar}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[18px] font-semibold leading-[1.4] text-[#263238]">
            {author}
          </span>
          {role && (
            <span className="text-[16px] leading-[1.4] text-[#546e7a]">
              {role}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
