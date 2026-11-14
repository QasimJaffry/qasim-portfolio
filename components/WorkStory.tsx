"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Phone from "@/components/Phone";
import type { Screen } from "@/lib/screens";

export type StoryItem = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  metrics: string[];
  screens: Screen[];
  tint: string;
};

/**
 * Selected work as chapters. On large screens one phone stays pinned and switches to the
 * app whose chapter is in the middle of the screen; on phones each chapter carries its own.
 */
export default function WorkStory({ items }: { items: StoryItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = items[active];

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-24 xl:gap-32">
      <ol>
        {items.map((p, i) => (
          <li
            key={p.slug}
            data-chapter
            data-i={i}
            className="flex flex-col justify-center border-t border-border py-16 lg:min-h-[88vh] lg:py-24"
          >
            {p.screens.length > 0 && (
              <Phone screens={p.screens} className="mx-auto mb-10 w-[13.5rem] lg:hidden" />
            )}
            <p className="text-muted">
              {p.category}, {p.year}
            </p>
            <h3
              className={`hd mt-3 text-[clamp(3rem,8vw,6.5rem)] transition-colors duration-500 ${
                i === active ? "text-foreground" : "text-foreground lg:text-foreground/35"
              }`}
            >
              {p.title}
            </h3>
            <p className="mt-5 max-w-xl text-xl leading-[1.5] text-foreground/75 sm:text-2xl">{p.tagline}</p>
            <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
              {p.metrics.slice(0, 3).map((m) => (
                <li key={m} className="font-display text-lg font-semibold text-foreground">
                  {m}
                </li>
              ))}
            </ul>
            <Link
              href={`/work/${p.slug}`}
              className="mt-10 inline-flex w-fit items-center rounded-full border border-foreground/25 px-6 py-3 font-display text-[15px] font-semibold text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
            >
              Read the {p.title} case study
            </Link>
          </li>
        ))}
      </ol>

      <div className="hidden lg:block">
        <div className="sticky top-0 flex h-dvh items-center pt-14">
          <div className="relative w-full">
            <div
              aria-hidden
              className="absolute -inset-x-4 -inset-y-20 rounded-full opacity-35 blur-3xl transition-colors duration-700"
              style={{ backgroundColor: current?.tint }}
            />
            <Phone screens={current?.screens ?? []} caption className="relative mx-auto w-[17rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
