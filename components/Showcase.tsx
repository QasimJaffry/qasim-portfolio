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

const proof = [
  ["6+", "years shipping"],
  ["60+", "products shipped"],
  ["10K+", "Play Store downloads"],
];

/**
 * Hero and work in one piece. On large screens the left panel stays pinned (headline, intro,
 * project index) while the right column scrolls through the projects. On phones the index
 * becomes a sticky row of chips and the screenshots run edge to edge.
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
  const chipsRef = useRef<HTMLDivElement>(null);

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

  // Keep the active chip visible in the phone chip row, without moving the page.
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (!row || !chip) return;
    row.scrollTo({
      left: chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

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
    <section id="work">
      {/* Phones: the project index as a sticky row of chips under the header */}
      <div
        ref={chipsRef}
        role="navigation"
        aria-label="Projects"
        className="sticky top-[3.9rem] z-30 flex gap-2 overflow-x-auto border-b border-white/10 bg-background/90 px-6 py-3 backdrop-blur-md [scrollbar-width:none] sm:px-10 lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const on = item.slug === active;
          return (
            <a
              key={item.slug}
              href={`#p-${item.slug}`}
              data-chip={item.slug}
              aria-current={on ? "true" : undefined}
              className={`shrink-0 rounded-full border px-4 py-1.5 font-display text-sm font-semibold transition-colors ${
                on
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-white/15 text-foreground/80"
              }`}
            >
              {item.title}
            </a>
          );
        })}
      </div>

      <div className="px-6 sm:px-10">
        <div className="mx-auto grid max-w-[88rem] gap-x-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="py-10 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col lg:justify-between lg:overflow-y-auto lg:py-10">
            <div>
              <p className="text-base text-muted sm:text-lg">{site.availability.status}</p>

              <h1 className="hd mt-5 text-balance text-[clamp(2.2rem,9vw,3.6rem)] leading-[1.03] text-foreground sm:text-[clamp(3rem,6.4vw,4.2rem)] lg:text-[clamp(2.3rem,3.5vw,4rem)]">
                <span className="line">
                  <span className="rise" style={{ ["--d" as string]: 0 }}>
                    Senior full-stack engineer building mobile, AI and subscription products.
                  </span>
                </span>
              </h1>

              <p className="mt-5 max-w-md text-lg leading-[1.55] text-foreground/75 lg:text-[1.05rem]">
                I&apos;m Qasim Hassan. I work with founders and product teams to take apps from first
                prototype to live on the App Store and Google Play, with payments, AI features and the
                backend already working.
              </p>

              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-x-8">
                <a href={mailtoHref()} className="btn-primary w-full justify-center sm:w-auto">
                  Start a project
                </a>
                <div className="flex items-center gap-x-8">
                  <Link href="/work" className="btn-secondary link-underline">
                    All projects
                  </Link>
                  <Link href="/resume" className="btn-secondary link-underline">
                    Resume
                  </Link>
                </div>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 lg:hidden">
                {proof.map(([value, label]) => (
                  <div key={label}>
                    <dt className="hd text-3xl text-foreground sm:text-4xl">{value}</dt>
                    <dd className="mt-1 text-sm leading-snug text-muted">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <nav aria-label="Projects" className="mt-8 hidden lg:block">
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
                          className={`inline-block font-display text-xl font-semibold tracking-tight transition-[color,transform] xl:text-2xl duration-300 ${
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

          <div ref={columnRef} className="space-y-20 pb-20 lg:space-y-44 lg:py-14 lg:pb-40">
            {items.map((item, i) => (
              <article
                key={item.slug}
                id={`p-${item.slug}`}
                data-reveal-root
                className={`scroll-mt-32 lg:scroll-mt-24 ${i % 2 === 1 ? "lg:ml-auto lg:w-[86%]" : ""}`}
              >
                {item.image && (
                  <Link
                    href={`/work/${item.slug}`}
                    aria-label={`${item.title} case study`}
                    onMouseMove={follow}
                    style={i === 0 ? { transitionDelay: "650ms" } : undefined}
                    className={`reveal-pre group relative -mx-6 block overflow-hidden border-y border-white/10 bg-surface sm:-mx-10 lg:mx-0 lg:rounded-2xl lg:border ${
                      i % 2 === 0 ? "aspect-[4/3]" : "aspect-[5/4]"
                    }`}
                  >
                    <div
                      data-parallax
                      className="absolute inset-0 will-change-transform"
                      style={{ transform: "scale(1.08)" }}
                    >
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

                <div className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-[1fr_auto] sm:items-baseline">
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
      </div>
    </section>
  );
}
