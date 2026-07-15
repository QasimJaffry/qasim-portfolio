"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ProjectCategory } from "@/lib/data/projects";

const tint: Record<ProjectCategory, number> = {
  Mobile: 10,
  Web: 16,
  AI: 24,
  "Full-Stack": 13,
};

type FigurePlateProps = {
  /** Resolved, existing image path. Pass undefined to render the index plate. */
  src?: string;
  alt: string;
  index?: number;
  label?: string;
  category?: ProjectCategory;
  aspect?: "portrait" | "landscape";
  tilt?: "left" | "right" | "none";
  className?: string;
};

export default function FigurePlate({
  src,
  alt,
  index,
  label,
  category = "AI",
  aspect = "landscape",
  tilt = "none",
  className = "",
}: FigurePlateProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const baseTilt = tilt === "left" ? -1.25 : tilt === "right" ? 1.25 : 0;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function handleLeave() {
    const el = frameRef.current;
    if (!el) return;
    el.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) rotate(${baseTilt}deg)`;
  }

  return (
    <figure className={`group ${className}`}>
      <div
        ref={frameRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`relative overflow-hidden rounded-2xl transition-transform duration-300 ease-out will-change-transform ${
          aspect === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"
        }`}
        style={{ transform: `rotate(${baseTilt}deg)` }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <IndexPlate index={index} category={category} />
        )}
      </div>

      {label && (
        <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-wide text-muted">
          {index !== undefined ? `${String(index).padStart(2, "0")} — ` : ""}
          {label}
        </figcaption>
      )}
    </figure>
  );
}

function IndexPlate({ index, category }: { index?: number; category: ProjectCategory }) {
  return (
    <div
      className="relative flex h-full w-full items-end justify-end overflow-hidden"
      style={{
        backgroundColor: `color-mix(in srgb, var(--accent) ${tint[category]}%, var(--surface))`,
      }}
    >
      {index !== undefined && (
        <span
          className="pointer-events-none select-none font-display font-medium leading-none"
          style={{
            fontSize: "6.5rem",
            color: "color-mix(in srgb, var(--accent) 55%, transparent)",
            transform: "translate(10%, 14%)",
          }}
        >
          {String(index).padStart(2, "0")}
        </span>
      )}
      <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-accent">
        {category}
      </span>
    </div>
  );
}
