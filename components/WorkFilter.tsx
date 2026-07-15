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

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-accent text-accent-foreground"
                : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
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
