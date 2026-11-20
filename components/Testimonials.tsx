"use client";

import { useState } from "react";
import { testimonials } from "@/lib/data/testimonials";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];
  const count = testimonials.length;

  return (
    <section id="proof" className="scroll-mt-20">
      <h2 className="hd text-[clamp(2.8rem,7vw,5.5rem)] text-foreground">In their words</h2>
      <div>
        <figure className="mt-8">
          <blockquote
            aria-live="polite"
            className="min-h-[12rem] max-w-5xl text-[clamp(1.6rem,3.2vw,2.8rem)] leading-[1.3] text-foreground"
          >
            “{item.quote}”
          </blockquote>

          <figcaption className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-display text-lg font-semibold text-foreground">{item.name}</p>
              <p className="mt-1 text-base text-muted">
                {item.role}
                {item.source ? `, via ${item.source}` : ""}
              </p>
            </div>
            {count > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous quote"
                onClick={() => setIndex((index - 1 + count) % count)}
                className="flex size-11 items-center justify-center rounded-full border border-foreground/25 font-display text-lg text-foreground transition-colors hover:border-foreground hover:bg-accent hover:text-accent-foreground"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next quote"
                onClick={() => setIndex((index + 1) % count)}
                className="flex size-11 items-center justify-center rounded-full border border-foreground/25 font-display text-lg text-foreground transition-colors hover:border-foreground hover:bg-accent hover:text-accent-foreground"
              >
                →
              </button>
              <span className="ml-1 text-sm tabular-nums text-muted">
                {index + 1} of {count}
              </span>
            </div>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
