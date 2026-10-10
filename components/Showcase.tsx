"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mailtoHref, site } from "@/lib/site";

export type ShowcaseItem = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  metrics: string[];
  image: string | null;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Hero and work in one piece. The left panel stays pinned (headline, intro, project index);
 * the right column scrolls through the projects and the index follows along.
 *
 * Motion, and what each piece is for:
 *  - each screenshot wipes open the first time it comes into view (you are opening a project)
 *  - the picture drifts a few pixels inside its frame as you scroll (depth, tied to your scroll)
 *  - a round "open" bubble follows the cursor over a screenshot (it is clickable)
 *  - a thin rail beside the index fills as you move through the work (where you are)
 */
export default function Showcase({ items }: { items: ShowcaseItem[] }) {
  const [active, setActive] = useState(items[0]?.slug ?? "");
  const columnRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);

  // Which project is in the middle of the screen.
  useEffect(() => {
    const els = items
      .map((item) => document.getElementById(`p-${item.slug}`))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id.replace("p-", ""));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // Wipe each screenshot open once, the first time it is seen.
  useEffect(() => {
    // Watch the whole project block, not the clipped image itself: a fully clipped element can
    // report as not intersecting in some browsers, which would leave it hidden for good.
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal-root]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal-pre").forEach((el) => el.classList.add("is-in"));
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // Scroll-linked: the rail fill and the slow drift of each picture.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;

      const column = columnRef.current;
      const rail = railRef.current;
      if (column && rail) {
        const r = column.getBoundingClientRect();
        const p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
        rail.style.setProperty("--p", p.toFixed(4));
      }

      if (reduce) return;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - vh / 2) / vh;
        const y = clamp(offset * -32, -18, 18);
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(1.08)`;
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function follow(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <section id="work" className="px-6 sm:px-10">
      <div className="mx-auto grid max-w-[88rem] gap-x-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="py-12 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col lg:justify-between lg:overflow-y-auto lg:py-14">
          <div>
            <p className="text-xl text-muted">
              Hi, I&apos;m Qasim, a senior full-stack engineer in {site.location.split(",")[0]}.
            </p>

            <h1 className="hd mt-5 text-[clamp(3rem,5.4vw,5.6rem)] leading-[0.98] text-foreground">
              <span className="line">
                <span className="rise" style={{ ["--d" as string]: 0 }}>
                  I build apps
                </span>
              </span>
              <span className="line">
                <span className="rise" style={{ ["--d" as string]: 1 }}>
                  people install
                </span>
              </span>
              <span className="line">
                <span className="rise" style={{ ["--d" as string]: 2 }}>
                  and pay for.
                </span>
              </span>
            </h1>

            <p className="mt-7 max-w-md text-lg leading-[1.55] text-foreground/75">
              Six years, more than sixty products shipped, and a Top Rated Plus badge on Upwork. I take
              mobile and web products from the first sketch to the App Store, Google Play and a working
              Stripe checkout.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href={mailtoHref()} className="btn-primary">
                Start a project
              </a>
              <Link href="/work" className="btn-secondary link-underline">
                All projects
              </Link>
              <Link href="/resume" className="btn-secondary link-underline">
                Resume
              </Link>
            </div>
          </div>

          <nav aria-label="Projects" className="mt-12 hidden lg:block">
            <p className="text-base text-muted">Selected work</p>
            <div className="relative mt-3 pl-6">
              <span aria-hidden className="absolute bottom-1 left-0 top-1 w-px bg-white/15" />
              <span
                ref={railRef}
                aria-hidden
                className="absolute left-0 top-1 w-px bg-accent"
                style={{ height: "calc((100% - 0.5rem) * var(--p, 0))" }}
              />
              <ul className="space-y-1">
                {items.map((item) => {
                  const on = item.slug === active;
                  return (
                    <li key={item.slug}>
                      <a
                        href={`#p-${item.slug}`}
                        aria-current={on ? "true" : undefined}
                        className={`inline-block font-display text-2xl font-semibold tracking-tight transition-[color,transform] duration-300 ${
                          on
                            ? "translate-x-2 text-foreground"
                            : "text-foreground/40 hover:text-foreground/80"
                        }`}
                      >
                        {item.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>

        <div ref={columnRef} className="space-y-24 pb-24 lg:space-y-44 lg:py-14 lg:pb-40">
          {items.map((item, i) => (
            <article
              key={item.slug}
              id={`p-${item.slug}`}
              data-reveal-root
              className={`scroll-mt-24 ${i % 2 === 1 ? "lg:ml-auto lg:w-[86%]" : ""}`}
            >
              {item.image && (
                <Link
                  href={`/work/${item.slug}`}
                  aria-label={`${item.title} case study`}
                  onMouseMove={follow}
                  style={i === 0 ? { transitionDelay: "650ms" } : undefined}
                  className={`reveal-pre group relative block overflow-hidden rounded-2xl border border-white/10 bg-surface ${
                    i % 2 === 0 ? "aspect-[4/3]" : "aspect-[5/4]"
                  }`}
                >
                  <div data-parallax className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.08)" }}>
                    <Image
                      src={item.image}
                      alt={`${item.title} preview`}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className="object-cover"
                    />
                  </div>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-[var(--mx,50%)] top-[var(--my,50%)] z-10 hidden size-24 -translate-x-1/2 -translate-y-1/2 scale-50 items-center justify-center rounded-full bg-accent px-3 text-center font-display text-sm font-semibold leading-tight text-accent-foreground opacity-0 transition-[opacity,transform] duration-300 group-hover:scale-100 group-hover:opacity-100 lg:flex"
                  >
                    Open case study
                  </span>
                </Link>
              )}

              <div className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-[1fr_auto] sm:items-baseline">
                <h2 className="hd text-4xl text-foreground sm:text-5xl">{item.title}</h2>
                <p className="text-base text-muted">
                  {item.category}, {item.year}
                </p>
              </div>
              <p className="mt-3 max-w-lg text-xl leading-[1.5] text-foreground/75">{item.tagline}</p>
              <ul className="mt-5 space-y-1 font-display text-base font-medium text-foreground">
                {item.metrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
              <Link
                href={`/work/${item.slug}`}
                className="mt-6 inline-block font-display text-[15px] font-semibold text-accent underline decoration-2 underline-offset-[6px] transition-colors hover:text-foreground"
              >
                Read the case study
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
