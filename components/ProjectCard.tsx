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
}: {
  project: Project;
  image?: string;
  index: number;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block rounded-2xl p-3 transition-colors duration-200 hover:bg-accent/[0.06]"
    >
      <FigurePlate
        src={image}
        alt={`${project.title} preview`}
        index={index}
        category={project.category}
        tilt="none"
      />

      <div className="pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-3 text-xs text-muted">
            <span>{project.year}</span>
            <span>{project.category}</span>
          </div>
          <div className="flex items-center gap-2">
            {project.featured && <span className="tag-pill">Featured</span>}
            <span className="tag-pill inline-flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot[project.status]}`} />
              {project.status}
            </span>
          </div>
        </div>

        <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-foreground">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{project.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="tag-pill">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
