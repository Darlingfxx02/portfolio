import type { ReactNode } from "react";

export type CaseHeroProps = {
  /** Маленький логотип студии/автора сверху по центру. */
  studioLogo?: ReactNode;
  /** Крупный логотип/название проекта позади мокапа. */
  projectLogo: ReactNode;
  /** Мокап по центру (iPhone, ноутбук, скрин и т.п.). */
  mockup?: ReactNode;
  /** Цвет фона. */
  background?: string;
  className?: string;
};

export function CaseHero({
  studioLogo,
  projectLogo,
  mockup,
  background = "#f4f4f4",
  className,
}: CaseHeroProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl ${className ?? ""}`}
      style={{
        background,
        aspectRatio: "1400 / 775",
      }}
    >
      {studioLogo && (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "5.16%" }}
        >
          {studioLogo}
        </div>
      )}

      <div
        className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center"
        style={{
          top: "47.48%",
          width: "82.57%",
          height: "40.39%",
        }}
      >
        {projectLogo}
      </div>

      {mockup && (
        <div
          className="absolute"
          style={{
            top: "11.48%",
            left: "30.79%",
            width: "41.79%",
            height: "128%",
          }}
        >
          {mockup}
        </div>
      )}

      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: "37.81%",
          height: "62.19%",
          background: `linear-gradient(to top, ${background} 4.5%, ${hexToRgba(
            background,
            0.06,
          )} 29.96%, ${hexToRgba(background, 0)} 68.82%)`,
        }}
      />
    </div>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
