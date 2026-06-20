import { useState } from "react";
import { createPortal } from "react-dom";
import { VideoPlayer } from "./VideoPlayer";
import { youTubeId } from "@/lib/youtube";

export type VideoCardProps = {
  /** Имя компании-получателя — подставляется в «Hello {company}». */
  company: string;
  /** Ссылка на YouTube-видео, открывается в новой вкладке. */
  href: string;
  /** Подпись под заголовком. */
  subtitle?: string;
  /** Длительность видео — в скобках рядом с подписью, напр. «1 минута 30 секунд». */
  duration?: string;
  /** URL превью-картинки видео. Без неё показывается белый плейсхолдер. */
  thumbnail?: string;
  /** Текст на кнопке. */
  ctaLabel?: string;
  className?: string;
};

/**
 * Презентационная карточка для конкретной компании. По клику открывает
 * полноэкранный плеер (VideoPlayer) с YouTube-видео; если href не YouTube —
 * фолбэк на открытие ссылки в новой вкладке.
 * Лейаут — точный перенос Figma node 1088:3779. Цвета привязаны к токенам темы
 * (--text / --text-dim), поэтому карточка читается и в светлой, и в тёмной теме.
 * Open-кнопка инвертирована относительно фона (bg --text / контент --bg):
 * светлая тема — чёрная кнопка, тёмная — белая.
 */
export function VideoCard({
  company,
  href,
  subtitle = "Self presentation video",
  duration,
  thumbnail,
  ctaLabel = "Open",
  className,
}: VideoCardProps) {
  const [open, setOpen] = useState(false);
  const videoId = youTubeId(href);

  return (
    <>
      <button
        type="button"
        onClick={() =>
          videoId
            ? setOpen(true)
            : window.open(href, "_blank", "noopener,noreferrer")
        }
        className={`group relative isolate flex w-full cursor-pointer items-center gap-[6px] bg-transparent text-left ${className ?? ""}`}
      >
      {/* Тот же hover-хайлайт, что выезжает за строки кейсов (CaseStudies). */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-3 -inset-y-2 z-0 rounded-[10px] bg-[var(--fill)] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
      />
      <div className="relative z-[1] flex min-w-px flex-1 items-center gap-[12px]">
        <div className="h-[48px] w-[80px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--text)]">
          {thumbnail && (
            <img src={thumbnail} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-[2px] text-[16px] font-normal leading-tight tracking-[-0.64px]">
          <span className="flex min-w-0 items-baseline gap-[8px]">
            <span className="truncate text-[var(--text)]">Hello {company}</span>
            {duration && (
              <span className="shrink-0 text-[var(--text-dim)]">{duration}</span>
            )}
          </span>
          <span className="truncate text-[var(--text-dim)]">{subtitle}</span>
        </div>
      </div>

      <div className="relative z-[1] flex shrink-0 items-center justify-center gap-[5px] rounded-[9px] bg-[var(--text)] px-[10px] py-[6px]">
        <YoutubeFill className="size-[20px] shrink-0 text-[var(--bg)]" />
        <span className="whitespace-nowrap text-right text-[14px] font-medium leading-normal tracking-[-0.56px] text-[var(--bg)]">
          {ctaLabel}
        </span>
      </div>
      </button>

      {open &&
        videoId &&
        createPortal(
          <VideoPlayer
            videoId={videoId}
            title={`Hello ${company}`}
            onClose={() => setOpen(false)}
          />,
          document.body,
        )}
    </>
  );
}

/** ri:youtube-fill — точный SVG из макета (Figma 1088:3775). */
function YoutubeFill({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M10.2033 3.33333C10.6483 3.33583 11.7617 3.34667 12.945 3.39417L13.365 3.4125C14.5558 3.46833 15.7458 3.565 16.3367 3.72917C17.1242 3.95083 17.7425 4.59583 17.9517 5.41417C18.285 6.71417 18.3267 9.24917 18.3317 9.86333L18.3325 9.99V10.135C18.3267 10.7492 18.285 13.285 17.9517 14.5842C17.74 15.405 17.1208 16.0508 16.3367 16.2692C15.7458 16.4333 14.5558 16.53 13.365 16.5858L12.945 16.605C11.7617 16.6517 10.6483 16.6633 10.2033 16.665L10.0075 16.6658H9.795C8.85333 16.66 4.915 16.6175 3.66167 16.2692C2.875 16.0475 2.25583 15.4025 2.04667 14.5842C1.71333 13.2842 1.67167 10.7492 1.66667 10.135V9.86333C1.67167 9.24917 1.71333 6.71333 2.04667 5.41417C2.25833 4.59333 2.8775 3.9475 3.6625 3.73C4.915 3.38083 8.85417 3.33833 9.79583 3.33333H10.2033ZM8.3325 7.08333V12.9167L13.3325 10L8.3325 7.08333Z"
        fill="currentColor"
      />
    </svg>
  );
}
