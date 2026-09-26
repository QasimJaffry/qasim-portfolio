"use client";

import { useEffect, useRef, useState } from "react";

export const themes = [
  { id: "navy", label: "Navy + amber", bg: "#0b1320", accent: "#ffb020" },
  { id: "light", label: "Soft white + cobalt", bg: "#f7f6f2", accent: "#2d5bff" },
  { id: "forest", label: "Forest + lime", bg: "#0d1f1a", accent: "#c8f169" },
  { id: "violet", label: "Charcoal + violet", bg: "#16161a", accent: "#8b7cff" },
  { id: "sage", label: "Off-white + sage", bg: "#f3f1ea", accent: "#4f6f54" },
  { id: "clay", label: "Linen + terracotta", bg: "#f2efe8", accent: "#b5532e" },
  { id: "indigo", label: "Cool gray + indigo", bg: "#f3f4f6", accent: "#4f52e8" },
  { id: "coral", label: "Charcoal + coral", bg: "#1f1f22", accent: "#ff6b6b" },
  { id: "sand", label: "Sand + forest green", bg: "#efe6d4", accent: "#2f6b4f" },
  { id: "slate", label: "Warm gray + slate blue", bg: "#eceae6", accent: "#4a6b88" },
  { id: "mocha", label: "Mocha + rose gold", bg: "#1e1714", accent: "#d99a7c" },
  { id: "rose", label: "Blush + rose", bg: "#fbf3f2", accent: "#b5636b" },
  { id: "burgundy", label: "Ivory + burgundy", bg: "#fbf8ef", accent: "#722f37" },
  { id: "neon", label: "Midnight + neon green", bg: "#0d0d0d", accent: "#39ff14" },
  { id: "ocean", label: "White + ocean blue", bg: "#f6fafc", accent: "#0077b6" },
] as const;

type ThemeId = (typeof themes)[number]["id"];

function Swatch({ bg, accent, size = "size-6" }: { bg: string; accent: string; size?: string }) {
  return (
    <span
      aria-hidden
      className={`${size} shrink-0 rounded-full border border-black/15`}
      style={{ background: `linear-gradient(135deg, ${bg} 50%, ${accent} 50%)` }}
    />
  );
}

export default function ThemeToggle({
  className = "",
  placement = "up",
}: {
  className?: string;
  placement?: "up" | "down";
}) {
  const [theme, setTheme] = useState<ThemeId>("navy");
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (themes.some((t) => t.id === current)) setTheme(current as ThemeId);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(next: ThemeId) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable — the choice just won't persist */
    }
  }

  const current = themes.find((t) => t.id === theme) ?? themes[0];

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-2.5 rounded-full border border-border py-1.5 pl-1.5 pr-3.5 text-xs font-medium text-foreground transition-colors hover:border-accent"
      >
        <Swatch bg={current.bg} accent={current.accent} />
        <span className="whitespace-nowrap">{current.label}</span>
      </button>

      {open && (
        <div
          role="group"
          aria-label="Colour theme"
          className={`absolute z-50 w-64 rounded-2xl border border-border bg-background p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] ${
            placement === "up" ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2"
          }`}
        >
          <p className="px-1 pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Colour theme
          </p>
          <div className="grid grid-cols-5 gap-2.5">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => choose(t.id)}
                aria-pressed={theme === t.id}
                aria-label={t.label}
                title={t.label}
                className={`flex justify-center rounded-full p-0.5 transition-transform hover:scale-110 ${
                  theme === t.id ? "ring-2 ring-foreground" : ""
                }`}
              >
                <Swatch bg={t.bg} accent={t.accent} size="size-9" />
              </button>
            ))}
          </div>
          <p className="px-1 pt-3 text-xs text-muted">{current.label}</p>
        </div>
      )}
    </div>
  );
}
