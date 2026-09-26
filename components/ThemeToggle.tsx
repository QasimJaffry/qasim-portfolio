"use client";

import { useEffect, useState } from "react";

export const themes = [
  { id: "navy", label: "Navy + amber", bg: "#0b1320", accent: "#ffb020" },
  { id: "light", label: "Soft white + cobalt", bg: "#f7f6f2", accent: "#2d5bff" },
  { id: "forest", label: "Forest + lime", bg: "#0d1f1a", accent: "#c8f169" },
  { id: "violet", label: "Charcoal + violet", bg: "#16161a", accent: "#8b7cff" },
  { id: "sage", label: "Off-white + sage", bg: "#f3f1ea", accent: "#4f6f54" },
  { id: "clay", label: "Linen + terracotta", bg: "#f2efe8", accent: "#b5532e" },
] as const;

type ThemeId = (typeof themes)[number]["id"];

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeId>("navy");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (themes.some((t) => t.id === current)) setTheme(current as ThemeId);
  }, []);

  function choose(next: ThemeId) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable — the choice just won't persist */
    }
  }

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className={`inline-flex items-center gap-1.5 rounded-full border border-border p-1.5 ${className}`}
    >
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => choose(t.id)}
          aria-pressed={theme === t.id}
          aria-label={t.label}
          title={t.label}
          className={`relative size-6 rounded-full border border-black/15 transition-transform hover:scale-110 ${
            theme === t.id ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
          }`}
          style={{ background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)` }}
        />
      ))}
    </div>
  );
}
