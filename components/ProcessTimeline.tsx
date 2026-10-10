"use client";

import { useEffect, useRef } from "react";

type Step = { step: string; title: string; detail: string };

/**
 * A real sequence, so it gets a real timeline: when it scrolls into view the line draws
 * itself and each stop lights up in turn.
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
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className="tl relative mt-16 grid gap-12 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
      <span
        aria-hidden
        className="tl-line absolute left-0 right-0 top-[0.6rem] hidden h-px bg-accent/60 xl:block"
      />
      <span
        aria-hidden
        className="absolute left-0 right-0 top-[0.6rem] -z-0 hidden h-px bg-white/15 xl:block"
      />
      {steps.map((item, i) => (
        <li key={item.step} className="relative" style={{ ["--i" as string]: i }}>
          <span className="tl-dot relative z-10 block size-5 rounded-full border-2 border-accent bg-background" />
          <div className="tl-body">
            <p className="hd mt-6 text-5xl text-accent/80">{i + 1}</p>
            <h4 className="hd mt-3 text-2xl text-foreground">{item.title}</h4>
            <p className="mt-2 max-w-xs text-lg leading-[1.5] text-muted">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
