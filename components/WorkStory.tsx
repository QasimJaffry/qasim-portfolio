"use client";

import Image from "next/image";
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
  /** Desktop capture shown in a browser window behind the phone (wide screens only). */
  web?: string;
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
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-24 xl:grid-cols-[minmax(0,1fr)_34rem] xl:gap-20">
      <ol>
        {items.map((p, i) => (
          <li
            key={p.slug}
            data-chapter
            data-i={i}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-5 border-t border-border py-10 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-8 lg:flex lg:min-h-[88vh] lg:flex-col lg:justify-center lg:py-24"
          >
            {p.screens.length > 0 && <Phone screens={p.screens} compact className="row-span-2 w-full lg:hidden" />}
            <div className="self-center">
              <p className="text-sm text-muted sm:text-base">
                {p.category}, {p.year}
              </p>
              <h3
                className={`hd mt-2 text-[clamp(1.45rem,7.4vw,6.5rem)] transition-colors duration-500 sm:mt-3 ${
                  i === active ? "text-foreground" : "text-foreground lg:text-foreground/35"
                }`}
              >
                {p.title}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-[1.5] text-foreground/75 sm:mt-5 sm:text-xl lg:text-2xl">
                {p.tagline}
              </p>
            </div>
            <div className="col-span-2 mt-6 sm:col-span-1 sm:col-start-2 lg:mt-0">
              <ul className="flex flex-wrap gap-x-8 gap-y-2 lg:mt-8 lg:gap-x-10 lg:gap-y-3">
                {p.metrics.slice(0, 3).map((m) => (
                  <li key={m} className="font-display text-[15px] font-semibold text-foreground sm:text-lg">
                    {m}
                  </li>
                ))}
              </ul>
              <Link
                href={`/work/${p.slug}`}
                aria-label={`Read the ${p.title} case study`}
                className="mt-6 inline-flex w-fit items-center rounded-full border border-foreground/25 px-6 py-3 font-display text-[15px] font-semibold text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground lg:mt-10"
              >
                Read the case study
              </Link>
            </div>
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
            {current?.web && (
              <div
                key={current.web}
                className="absolute left-0 top-6 hidden w-[88%] animate-fade-up overflow-hidden rounded-xl bg-[#0b1220] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15 xl:block"
              >
                <div aria-hidden className="flex h-7 items-center gap-1.5 border-b border-white/10 px-3">
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="size-2.5 rounded-full bg-white/20" />
                </div>
                <div className="relative aspect-[16/10]">
                  <Image src={current.web} alt={`${current.title} web app`} fill sizes="34rem" className="object-cover object-top" />
                </div>
              </div>
            )}
            <Phone
              screens={current?.screens ?? []}
              caption
              className={`relative mx-auto w-[17rem] ${current?.web ? "xl:mr-0 xl:mt-28 xl:w-[13rem]" : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
