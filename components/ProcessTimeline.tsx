"use client";

import { useEffect, useRef } from "react";

type Step = { step: string; title: string; detail: string };

/**
 * A real sequence, so it gets a real timeline: when it scrolls into view the line draws
 * itself and each stop lights up in turn. Vertical on phones, horizontal on wide screens.
 */
export default function ProcessTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className="tl relative mt-14 grid gap-10 sm:mt-16 sm:grid-cols-2 sm:gap-12 xl:grid-cols-4 xl:gap-8">
      {/* phones: vertical line */}
      <span aria-hidden className="absolute bottom-2 left-[0.55rem] top-2 w-px bg-white/15 sm:hidden" />
      <span
        aria-hidden
        className="tl-line-v absolute bottom-2 left-[0.55rem] top-2 w-px bg-accent/70 sm:hidden"
      />
      {/* wide screens: horizontal line */}
      <span aria-hidden className="absolute left-0 right-0 top-[0.6rem] hidden h-px bg-white/15 xl:block" />
      <span
        aria-hidden
        className="tl-line absolute left-0 right-0 top-[0.6rem] hidden h-px bg-accent/70 xl:block"
      />
      {steps.map((item, i) => (
        <li key={item.step} className="relative pl-10 sm:pl-0" style={{ ["--i" as string]: i }}>
          <span className="tl-dot absolute left-0 top-1 z-10 block size-5 rounded-full border-2 border-accent bg-background sm:static" />
          <div className="tl-body">
            <p className="hd text-4xl text-accent/80 sm:mt-6 sm:text-5xl">{i + 1}</p>
            <h4 className="hd mt-2 text-2xl text-foreground sm:mt-3">{item.title}</h4>
            <p className="mt-2 max-w-xs text-lg leading-[1.5] text-muted">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
