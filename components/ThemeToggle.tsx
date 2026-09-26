"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable — the choice just won't persist */
    }
  }

  const option = (value: Theme, label: string) => (
    <button
      type="button"
      onClick={() => choose(value)}
      aria-pressed={theme === value}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        theme === value ? "bg-foreground text-background" : "text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className={`inline-flex items-center gap-0.5 rounded-full border border-border p-0.5 ${className}`}
    >
      {option("dark", "Dark")}
      {option("light", "Light")}
    </div>
  );
}
