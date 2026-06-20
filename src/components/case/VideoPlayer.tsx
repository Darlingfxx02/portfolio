import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, SpeakerHigh, SpeakerSlash, X } from "@phosphor-icons/react";
import {
  formatTime,
  loadYouTubeAPI,
  type YTPlayer,
} from "@/lib/youtube";

export type VideoPlayerProps = {
  /** 11-символьный id YouTube-видео. */
  videoId: string;
  /** Подпись в углу плеера. */
  title?: string;
  /** Закрыть оверлей. */
  onClose: () => void;
};

const HIDE_DELAY = 2600;

/**
 * Полноэкранный минималистичный плеер: чёрный фон, видео 16:9 по центру,
 * собственные контролы поверх YouTube-iframe (нативные скрыты controls:0).
 * Всегда тёмный — это «кинозал», тема не влияет.
 */
export function VideoPlayer({ videoId, title, onClose }: VideoPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const rafRef = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [seeking, setSeeking] = useState(false);

  // ── Create / destroy the YouTube player ──────────────────────────
  useEffect(() => {
    let cancelled = false;
    let player: YTPlayer | null = null;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !hostRef.current) return;
      // YT replaces the inner node with an <iframe>; the React-owned wrapper
      // around hostRef stays intact for clean unmount.
      const inner = document.createElement("div");
      hostRef.current.appendChild(inner);

      player = new YT.Player(inner, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          iv_load_policy: 3,
          fs: 0,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            if (cancelled) return;
            playerRef.current = e.target;
            setDuration(e.target.getDuration());
            setMuted(e.target.isMuted());
            setReady(true);
            e.target.playVideo();
          },
          onStateChange: (e: { data: number }) => {
            if (cancelled) return;
            const S = YT.PlayerState;
            if (e.data === S.PLAYING) setPlaying(true);
            else if (e.data === S.PAUSED || e.data === S.ENDED)
              setPlaying(false);
            if (e.data === S.ENDED) setChromeVisible(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try {
        player?.destroy();
      } catch {
        /* iframe already gone */
      }
      playerRef.current = null;
    };
  }, [videoId]);

  // ── Poll playback position while playing ─────────────────────────
  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = () => {
      const p = playerRef.current;
      if (p) {
        if (!seeking) setCurrent(p.getCurrentTime());
        setBuffered(p.getVideoLoadedFraction());
        if (!duration) setDuration(p.getDuration());
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, seeking, duration]);

  // ── Auto-hide chrome while playing ───────────────────────────────
  const poke = useCallback(() => {
    setChromeVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      setChromeVisible(false);
    }, HIDE_DELAY);
  }, []);

  useEffect(() => {
    if (playing) poke();
    else {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setChromeVisible(true);
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [playing, poke]);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  }, [playing]);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  }, []);

  const seekBy = useCallback(
    (delta: number) => {
      const p = playerRef.current;
      if (!p) return;
      const t = Math.min(duration, Math.max(0, p.getCurrentTime() + delta));
      p.seekTo(t, true);
      setCurrent(t);
    },
    [duration],
  );

  // ── Keyboard + body scroll lock ──────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowRight") seekBy(5);
      else if (e.key === "ArrowLeft") seekBy(-5);
      else if (e.key === "m") toggleMute();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, togglePlay, seekBy, toggleMute]);

  const pct = duration ? (current / duration) * 100 : 0;
  const showChrome = chromeVisible || !playing || seeking;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black"
      onPointerMove={poke}
      style={{ cursor: showChrome ? "auto" : "none" }}
    >
      {/* Click-away to close on the black backdrop. */}
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      {/* Video stage — 16:9, fit within 92vw and 80vh. overflow-hidden crops the
          over-sized iframe so YouTube's own chrome (title bar, share / watch-later,
          watermark) lands in the trimmed letterbox bands, off-screen. */}
      <div className="relative aspect-video w-[min(92vw,142vh,1180px)] overflow-hidden">
        <div
          ref={hostRef}
          className="absolute inset-x-0 -inset-y-[90px] [&>iframe]:pointer-events-none [&>iframe]:h-full [&>iframe]:w-full"
        />

        {/* Transparent layer: click toggles play/pause. */}
        <button
          type="button"
          aria-label={playing ? "Пауза" : "Воспроизвести"}
          className="absolute inset-0 cursor-pointer"
          onClick={togglePlay}
        />

        {/* Center play affordance when paused. */}
        {ready && !playing && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex size-[72px] items-center justify-center rounded-full bg-black/55 backdrop-blur-sm">
              <Play weight="fill" size={30} className="ml-[3px] text-white" />
            </span>
          </div>
        )}

        {/* Controls bar. */}
        <div
          className={`absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 transition-opacity duration-300 ${
            showChrome ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <SeekBar
            pct={pct}
            buffered={buffered * 100}
            duration={duration}
            onScrub={(frac, done) => {
              const t = frac * duration;
              setCurrent(t);
              setSeeking(!done);
              if (done) playerRef.current?.seekTo(t, true);
            }}
          />
          <div className="flex items-center gap-4 text-white">
            <button
              type="button"
              aria-label={playing ? "Пауза" : "Воспроизвести"}
              onClick={togglePlay}
              className="grid place-items-center transition-opacity hover:opacity-70"
            >
              {playing ? (
                <Pause weight="fill" size={20} />
              ) : (
                <Play weight="fill" size={20} />
              )}
            </button>
            <button
              type="button"
              aria-label={muted ? "Включить звук" : "Выключить звук"}
              onClick={toggleMute}
              className="grid place-items-center transition-opacity hover:opacity-70"
            >
              {muted ? <SpeakerSlash size={20} /> : <SpeakerHigh size={20} />}
            </button>
            <span className="text-[13px] tabular-nums tracking-tight text-white/70">
              {formatTime(current)} <span className="text-white/35">/</span>{" "}
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Close + optional title. */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-5 py-5 transition-opacity duration-300 ${
          showChrome ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-[14px] font-medium tracking-tight text-white/80">
          {title}
        </span>
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="pointer-events-auto grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}

/** Thin draggable progress/seek line. */
function SeekBar({
  pct,
  buffered,
  duration,
  onScrub,
}: {
  pct: number;
  buffered: number;
  duration: number;
  onScrub: (fraction: number, done: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const fractionAt = (clientX: number) => {
    const el = ref.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!duration) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    onScrub(fractionAt(e.clientX), false);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 0 || !duration) return;
    onScrub(fractionAt(e.clientX), false);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!duration) return;
    onScrub(fractionAt(e.clientX), true);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="group/seek relative flex h-4 cursor-pointer items-center"
    >
      <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="absolute inset-y-0 left-0 bg-white/30"
          style={{ width: `${buffered}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-white"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Knob */}
      <span
        className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity group-hover/seek:opacity-100"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}
