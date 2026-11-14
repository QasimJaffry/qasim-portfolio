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
  aspect?: "portrait" | "landscape" | "slide";
  tilt?: "left" | "right" | "none";
  priority?: boolean;
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
  priority = false,
  className = "",
}: FigurePlateProps) {
  const baseTilt = tilt === "left" ? -1.25 : tilt === "right" ? 1.25 : 0;

  return (
    <figure className={`group ${className}`}>
      <div
        className={`relative overflow-hidden rounded-2xl ring-1 ring-border ${
          aspect === "portrait" ? "aspect-[3/4]" : aspect === "slide" ? "aspect-[4/3]" : "aspect-[16/10]"
        }`}
        style={{ transform: `rotate(${baseTilt}deg)` }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 1152px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <IndexPlate index={index} category={category} />
        )}
      </div>

      {label && (
        <figcaption className="mt-2 text-sm text-muted">
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
      <span className="absolute left-4 top-4 text-sm text-accent">
        {category}
      </span>
    </div>
  );
}
