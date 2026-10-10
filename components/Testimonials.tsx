"use client";

import { useState } from "react";
import { testimonials } from "@/lib/data/testimonials";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];
  const count = testimonials.length;

  return (
    <section id="proof" className="px-6 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto max-w-[88rem]">
        <figure className="grid gap-12 lg:grid-cols-12">
          <blockquote
            aria-live="polite"
            className="text-3xl leading-[1.35] text-foreground sm:text-[2.6rem] lg:col-span-9"
          >
            “{item.quote}”
          </blockquote>

          <figcaption className="flex flex-col justify-end gap-8 lg:col-span-3">
            <div>
              <p className="font-display text-lg font-semibold text-foreground">{item.name}</p>
              <p className="mt-1 text-base text-muted">
                {item.role}
                {item.source ? `, via ${item.source}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous quote"
                onClick={() => setIndex((index - 1 + count) % count)}
                className="flex size-12 items-center justify-center rounded-full border border-foreground/25 font-display text-lg text-foreground transition-colors hover:border-foreground hover:bg-accent hover:text-accent-foreground"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next quote"
                onClick={() => setIndex((index + 1) % count)}
                className="flex size-12 items-center justify-center rounded-full border border-foreground/25 font-display text-lg text-foreground transition-colors hover:border-foreground hover:bg-accent hover:text-accent-foreground"
              >
                →
              </button>
              <span className="ml-1 text-sm tabular-nums text-muted">
                {index + 1} of {count}
              </span>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
