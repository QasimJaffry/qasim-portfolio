"use client";

import { useRef } from "react";
import Image from "next/image";

type DeviceFrameProps = {
  src: string;
  alt: string;
  /** Text shown in the window's address bar. */
  label?: string;
  priority?: boolean;
  sizes?: string;
  /** Pointer tilt strength in degrees; 0 disables. */
  tilt?: number;
  className?: string;
};

/** Browser-window chrome around a project image, with a subtle pointer tilt. */
export default function DeviceFrame({
  src,
  alt,
  label,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 640px",
  tilt = 5,
  className = "",
}: DeviceFrameProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tilt || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${y * -tilt}deg) rotateY(${x * tilt}deg)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (el) el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`overflow-hidden rounded-xl border border-border bg-surface shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-border px-3.5 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        {label && (
          <p className="mx-auto max-w-[70%] truncate rounded-md bg-background px-3 py-0.5 font-mono text-[11px] text-muted">
            {label}
          </p>
        )}
        <span className="w-10 shrink-0" aria-hidden />
      </div>
      <div className="relative aspect-[16/10] bg-background">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    </div>
  );
}
