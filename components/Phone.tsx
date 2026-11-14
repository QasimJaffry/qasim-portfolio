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
  className = "",
}: {
  screens: Screen[];
  interval?: number;
  caption?: boolean;
  priority?: boolean;
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
        className="relative aspect-[9/19.5] w-full rounded-[2.6rem] bg-[#05080f] p-[0.55rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-black">
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
          <span aria-hidden className="absolute left-1/2 top-2 h-[1.35rem] w-[32%] -translate-x-1/2 rounded-full bg-black" />
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
