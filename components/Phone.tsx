"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Screen } from "@/lib/screens";

/**
 * A phone frame that plays real app screens. Cycles while on screen, pauses on hover and
 * when off screen, and stays on the first screen for people who prefer reduced motion.
 */
export default function Phone({
  screens,
  interval = 2600,
  caption = false,
  priority = false,
  compact = false,
  className = "",
}: {
  screens: Screen[];
  interval?: number;
  caption?: boolean;
  priority?: boolean;
  /** Small phones (about 7rem wide): tighter corners, bezel and island. */
  compact?: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // New playlist (the work section swaps apps): start from its first screen.
  useEffect(() => setIndex(0), [screens]);

  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible || screens.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % screens.length), interval);
    return () => window.clearInterval(id);
  }, [paused, visible, screens, interval]);

  const current = screens[index] ?? screens[0];

  return (
    <div className={className}>
      <div
        ref={ref}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className={`relative aspect-[9/19.5] w-full bg-[#05080f] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15 ${
          compact ? "rounded-[1.25rem] p-[0.25rem]" : "rounded-[2.6rem] p-[0.55rem]"
        }`}
      >
        <div className={`relative h-full w-full overflow-hidden bg-black ${compact ? "rounded-[1.05rem]" : "rounded-[2.1rem]"}`}>
          {screens.map((s, i) => {
            const fit = s.contain ? "object-contain bg-[#0b0a08]" : "object-cover object-top";
            const shown = i === index ? "opacity-100" : "opacity-0";
            return (
              <div key={s.src} aria-hidden={i !== index} className={`absolute inset-0 transition-opacity duration-700 ${shown}`}>
                <Image
                  src={s.src}
                  alt={i === index ? `${s.app} app screen` : ""}
                  fill
                  priority={priority && i === 0}
                  sizes="320px"
                  className={fit}
                />
                {s.video && i === index && visible && !reduced && (
                  <video
                    src={s.video}
                    poster={s.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden
                    className={`absolute inset-0 h-full w-full ${fit}`}
                  />
                )}
              </div>
            );
          })}
          <span
            aria-hidden
            className={`absolute left-1/2 w-[32%] -translate-x-1/2 rounded-full bg-black ${compact ? "top-1 h-[0.55rem]" : "top-2 h-[1.35rem]"}`}
          />
        </div>
      </div>

      {caption && current && (
        <p aria-live="polite" className="mt-5 text-center font-display text-[15px] font-medium text-muted">
          Now playing: <span className="text-foreground">{current.app}</span>
        </p>
      )}
    </div>
  );
}
