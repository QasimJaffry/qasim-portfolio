"use client";

import { useEffect, useState } from "react";

export const sections = [
  { id: "work", file: "work.tsx", label: "Work" },
  { id: "services", file: "services.md", label: "Services" },
  { id: "stack", file: "package.json", label: "Stack" },
  { id: "faq", file: "faq.md", label: "FAQ" },
  { id: "contact", file: "contact.sh", label: "Contact" },
] as const;

function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );

    els.forEach((el) => observer.observe(el));
    const onTop = () => {
      if (window.scrollY < 200) setActive("");
    };
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  return active;
}

export function SidebarIndex() {
  const active = useActiveSection();

  return (
    <nav aria-label="Sections">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Index</p>
      <ul className="mt-3 space-y-0.5">
        {sections.map((s, i) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={`flex items-center gap-3 rounded-md px-2 py-1.5 font-mono text-sm transition-colors ${
                  on ? "bg-surface text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                <span className="w-5 text-[11px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
                <span className={`ml-auto text-xs ${on ? "opacity-100" : "opacity-0"}`}>◂</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TabBar() {
  const active = useActiveSection();

  return (
    <div className="sticky top-0 z-40 flex items-stretch border-b border-border bg-background/90 backdrop-blur-md">
      <nav
        aria-label="Sections"
        className="flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <a
          href="#top"
          className={`shrink-0 border-r border-border px-4 py-3 font-mono text-xs transition-colors ${
            active === "" ? "bg-surface text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          <span className="mr-2 text-accent">●</span>
          index.tsx
        </a>
        {sections.map((s) => {
          const on = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`relative shrink-0 border-r border-border px-4 py-3 font-mono text-xs transition-colors ${
                on ? "bg-surface text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {on && <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-accent" />}
              {s.file}
            </a>
          );
        })}
      </nav>
      <div className="hidden shrink-0 items-center gap-5 border-l border-border px-5 font-mono text-xs text-muted sm:flex">
        <a href="/about" className="transition-colors hover:text-foreground">
          about
        </a>
        <a href="/resume" className="transition-colors hover:text-foreground">
          resume
        </a>
      </div>
    </div>
  );
}
