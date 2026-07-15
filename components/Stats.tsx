"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/data/stats";

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function StatTile({ label, value, delay }: { label: string; value: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  const [, prefix, digits, suffix] = match ?? ["", "", "", value];
  const count = useCountUp(match ? Number(digits) : 0, active);

  return (
    <div
      ref={ref}
      className={`reveal ${active ? "reveal-visible" : ""} rounded-2xl bg-accent/[0.07] px-4 py-6 text-center transition-colors duration-300 hover:bg-accent/[0.12]`}
      style={{ transitionDelay: active ? `${delay}ms` : "0ms" }}
    >
      <p className="font-display text-3xl font-medium tracking-tight text-foreground tabular-nums sm:text-4xl">
        {match ? `${prefix}${count}${suffix}` : value}
      </p>
      <p className="mt-2 text-xs uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, i) => (
          <StatTile key={stat.label} label={stat.label} value={stat.value} delay={i * 60} />
        ))}
      </div>
    </section>
  );
}
