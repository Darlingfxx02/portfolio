import type { CSSProperties, ReactNode } from "react";
import { ScrollLineReveal } from "@/components/motion/ScrollLineReveal";

export type TileCaptionPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type TileProps = {
  /** Текстовая подпись-ярлык в углу плитки (например, «Главная», «Поиск»). */
  caption?: string;
  captionPosition?: TileCaptionPosition;
  /** Подпись под плиткой — длинное описание. */
  description?: ReactNode;
  /** Высота плитки. По умолчанию 578px (как в Figma). */
  height?: number | string;
  /** Цвет заливки плитки. */
  background?: "muted" | "surface" | "transparent";
  /** Контент плитки — скрин, видео, мокап и т.п. */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const captionPositions: Record<TileCaptionPosition, string> = {
  "top-left": "top-6 left-6",
  "top-right": "top-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-right": "bottom-6 right-6",
};

const backgrounds = {
  muted: "bg-[#eceff1]",
  surface: "bg-white",
  transparent: "bg-transparent",
};

export function Tile({
  caption,
  captionPosition = "top-left",
  description,
  height = 578,
  background = "muted",
  children,
  className,
  style,
}: TileProps) {
  return (
    <div className={`flex flex-col gap-6 ${className ?? ""}`}>
      <div
        className={`relative w-full overflow-hidden rounded-3xl ${backgrounds[background]}`}
        style={{ height, ...style }}
      >
        {children}
        {caption && (
          <span
            className={`absolute ${captionPositions[captionPosition]} text-[16px] font-semibold leading-[1.19] text-[#263238]`}
          >
            {caption}
          </span>
        )}
      </div>
      {description &&
        (typeof description === "string" ? (
          <ScrollLineReveal
            as="p"
            className="text-[18px] leading-[1.5] text-[#546e7a]"
          >
            {description}
          </ScrollLineReveal>
        ) : (
          <p className="text-[18px] leading-[1.5] text-[#546e7a]">
            {description}
          </p>
        ))}
    </div>
  );
}
