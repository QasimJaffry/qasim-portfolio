"use client";

import { useRef } from "react";
import Magnetic from "@/components/Magnetic";

export default function Hero() {
  const blobA = useRef<HTMLDivElement>(null);
  const blobB = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (blobA.current) {
      blobA.current.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
    }
    if (blobB.current) {
      blobB.current.style.transform = `translate(${x * -30}px, ${y * -30}px)`;
    }
  }

  return (
    <section className="relative overflow-hidden" onMouseMove={handleMove}>
      <div
        ref={blobA}
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl transition-transform duration-500 ease-out"
      />
      <div
        ref={blobB}
        className="pointer-events-none absolute -bottom-32 -left-16 h-[320px] w-[320px] rounded-full bg-accent/[0.06] blur-3xl transition-transform duration-500 ease-out"
      />

      <div className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pb-16 sm:pt-24">
        <div className="animate-fade-up max-w-3xl">
          <span className="tag-pill">AI Products · Mobile · Scale</span>

          <h1 className="mt-6 font-display text-6xl font-medium tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            Qasim
            <br />
            <span className="relative inline-block">
              Hassan
              <span className="hero-underline absolute -bottom-1 left-0 -z-10 h-3 w-full bg-accent/25 sm:h-4" />
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            Senior Full-Stack Engineer shipping{" "}
            <span className="font-medium text-foreground">AI-native</span> mobile and web
            products, solo and in small teams.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Magnetic strength={0.4}>
              <a href="#featured-work" className="btn-primary">
                View Work
              </a>
            </Magnetic>
            <a
              href="https://linkedin.com/in/qasim-hassan-02871a171"
              className="btn-secondary link-underline"
            >
              LinkedIn ↗
            </a>
            <a href="https://github.com/QasimJaffry" className="btn-secondary link-underline">
              GitHub ↗
            </a>
          </div>

          <p className="mt-10 flex items-center gap-2.5 text-sm text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Lahore, Pakistan — Open to relocation (Germany · Canada · UAE)
          </p>
        </div>
      </div>
    </section>
  );
}
