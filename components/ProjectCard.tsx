import Link from "next/link";
import type { Project } from "@/lib/data/projects";
import FigurePlate from "@/components/FigurePlate";

const statusDot: Record<Project["status"], string> = {
  Live: "bg-accent",
  Completed: "bg-muted",
  "In Development": "bg-muted",
};

export default function ProjectCard({
  project,
  image,
  index,
  priority = false,
}: {
  project: Project;
  image?: string;
  index: number;
  priority?: boolean;
}) {
  const stack = project.stack.slice(0, 3);
  const remaining = project.stack.length - stack.length;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block"
    >
      <FigurePlate
        src={image}
        alt={`${project.title} preview`}
        index={index}
        category={project.category}
        tilt="none"
        priority={priority}
      />

      <div className="pt-4">
        <div className="flex items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-baseline gap-3">
            <span>{project.year}</span>
            <span>{project.category}</span>
          </div>
          <span className="inline-flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot[project.status]}`} />
            {project.status}
          </span>
        </div>

        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
          {project.title}
        </h2>
        <p className="mt-1 leading-[1.6] text-muted">{project.tagline}</p>

        <p className="mt-4 text-xs text-muted">
          {stack.join(" · ")}
          {remaining > 0 ? ` · +${remaining}` : ""}
        </p>
      </div>
    </Link>
  );
}
