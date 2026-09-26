"use client";

import { useState } from "react";
import { testimonials } from "@/lib/data/testimonials";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];
  const count = testimonials.length;

  return (
    <section id="proof" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <p className="eyebrow text-accent">What people say</p>

      <figure className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <span
          aria-hidden
          className="font-display text-[8rem] font-extrabold leading-[0.6] text-accent lg:col-span-1 lg:text-[10rem]"
        >
          “
        </span>
        <div className="lg:col-span-11">
          <blockquote
            key={index}
            className="animate-fade-up max-w-4xl text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {item.quote}
          </blockquote>
          <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="font-semibold text-foreground">{item.name}</p>
              <p className="mt-0.5 text-sm text-muted">
                {item.role}
                {item.source ? ` · ${item.source}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs tabular-nums text-muted">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <button
                type="button"
                aria-label="Previous quote"
                onClick={() => setIndex((index - 1 + count) % count)}
                className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next quote"
                onClick={() => setIndex((index + 1) % count)}
                className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                →
              </button>
            </div>
          </figcaption>
        </div>
      </figure>
    </section>
  );
}
