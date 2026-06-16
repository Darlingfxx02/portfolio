import type { ReactNode } from "react";
import { ScrollLineReveal } from "@/components/motion/ScrollLineReveal";

export type MediaWithTextProps = {
  /** Заголовок над текстом. */
  title: string;
  /** Текст (длинный параграф). */
  body: ReactNode;
  /** Медиа-контент с другой стороны (грид иконок, скрин, и т.п.). */
  children: ReactNode;
  /** На какой стороне текст. По умолчанию — слева. */
  side?: "left" | "right";
  /** Высота секции. По умолчанию 759px (как в Figma). */
  height?: number | string;
  className?: string;
};

export function MediaWithText({
  title,
  body,
  children,
  side = "left",
  height = 759,
  className,
}: MediaWithTextProps) {
  const textBlock = (
    <div className="flex w-[625px] shrink-0 flex-col gap-6 p-[50px]">
      <h2 className="text-[42px] font-semibold leading-[1.05] tracking-[-0.01em] text-[#263238]">
        {title}
      </h2>
      <div className="text-[18px] leading-[1.5] text-[#263238]">
        {typeof body === "string" ? (
          <ScrollLineReveal as="p">{body}</ScrollLineReveal>
        ) : (
          body
        )}
      </div>
    </div>
  );

  const mediaBlock = (
    <div className="flex flex-1 items-center justify-center p-6">{children}</div>
  );

  return (
    <div
      className={`flex w-full overflow-hidden rounded-3xl bg-[#eceff1] ${className ?? ""}`}
      style={{ minHeight: height }}
    >
      {side === "left" ? (
        <>
          {textBlock}
          {mediaBlock}
        </>
      ) : (
        <>
          {mediaBlock}
          {textBlock}
        </>
      )}
    </div>
  );
}
