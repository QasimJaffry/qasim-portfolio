"use client";

import { useMemo, useState } from "react";
import { type Project, type ProjectCategory } from "@/lib/data/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";

const filters: Array<ProjectCategory | "All"> = ["All", "Mobile", "Web", "AI", "Full-Stack"];

export default function WorkFilter({
  projects,
  images,
}: {
  projects: Project[];
  images: Record<string, string | undefined>;
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(() => {
    const list = filter === "All" ? projects : projects.filter((p) => p.category === filter);
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [filter, projects]);

  return (
    <>
      <div
        role="tablist"
        aria-label="Filter by category"
        className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-border/80 pb-3"
      >
        {filters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                active ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {f}
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {filtered.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 4) * 60}>
            <ProjectCard project={project} image={images[project.slug]} index={i + 1} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
