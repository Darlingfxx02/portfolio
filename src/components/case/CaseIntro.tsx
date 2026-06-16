import type { ReactNode } from "react";

export type CaseIntroProps = {
  /** Заголовок секции — обычно «Обзор», «Контекст», «Проблема». */
  title: string;
  /** Основной текст — параграф справа. */
  body: ReactNode;
  /** Теги, которые отображаются под текстом справа. */
  tags?: string[];
  className?: string;
};

export function CaseIntro({ title, body, tags, className }: CaseIntroProps) {
  return (
    <div
      className={`flex w-full gap-20 px-[50px] py-[60px] ${className ?? ""}`}
    >
      <h2 className="w-[420px] shrink-0 text-[42px] font-semibold leading-[1.05] tracking-[-0.01em] text-[#263238]">
        {title}
      </h2>

      <div className="flex max-w-[625px] flex-col gap-8">
        <div className="text-[18px] leading-[1.5] text-[#263238]">{body}</div>

        {tags && tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-[14px] bg-[#eceff1] px-4 py-[10px] text-[16px] font-semibold leading-[1.19] text-[#263238]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
