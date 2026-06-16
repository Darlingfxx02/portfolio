import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CaseHero } from "./CaseHero";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  studioLogo?: ReactNode;
  projectLogo: ReactNode;
  mockup?: ReactNode;
  background?: string;
  exitInset?: number;
  startWidth?: number;
};

export function HeroScrollMorph({
  studioLogo,
  projectLogo,
  mockup,
  background = "#f4f4f4",
  exitInset = 100,
  startWidth = 1200,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "+=80%",
        scrub: 0.3,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      card,
      { width: () => Math.min(startWidth, window.innerWidth - 48), borderRadius: 24 },
      { width: () => window.innerWidth, borderRadius: 0, duration: 1 },
    ).to(card, {
      width: () => window.innerWidth - exitInset * 2,
      borderRadius: 24,
      duration: 1,
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white"
    >
      <div
        ref={cardRef}
        className="overflow-hidden"
        style={{
          width: `min(${startWidth}px, calc(100vw - 48px))`,
          borderRadius: 24,
        }}
      >
        <CaseHero
          className="!rounded-none"
          studioLogo={studioLogo}
          projectLogo={projectLogo}
          mockup={mockup}
          background={background}
        />
      </div>
    </div>
  );
}
