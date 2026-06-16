import type { ReactNode } from "react";

export type TileRowProps = {
  /**
   * Пропорции колонок.
   * Массив чисел — относительные доли (например, [3, 2] = 60% / 40%).
   * Если не указано, колонки делятся поровну.
   */
  split?: number[];
  /** Зазор между плитками в px. По умолчанию 14 (как в Figma-сетке). */
  gap?: number;
  children: ReactNode;
  className?: string;
};

export function TileRow({
  split,
  gap = 14,
  children,
  className,
}: TileRowProps) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div
      className={`flex w-full ${className ?? ""}`}
      style={{ gap: `${gap}px` }}
    >
      {items.map((child, i) => {
        const flex = split?.[i] ?? 1;
        return (
          <div key={i} style={{ flex }} className="min-w-0">
            {child}
          </div>
        );
      })}
    </div>
  );
}
