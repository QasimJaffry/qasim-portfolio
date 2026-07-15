import Link from "next/link";
import { getFeaturedProjects } from "@/lib/data/projects";
import { resolveProjectImage } from "@/lib/projectImage";
import FigurePlate from "@/components/FigurePlate";
import Reveal from "@/components/Reveal";

export default function FeaturedProjects() {
  const featured = getFeaturedProjects();

  return (
    <section id="featured-work" className="mx-auto max-w-5xl px-6 pb-8 pt-16 sm:pb-12 sm:pt-24">
      <h2 className="eyebrow">Featured Work</h2>

      <div className="mt-8 flex flex-col gap-2">
        {featured.map((project, i) => {
          const liveHref = project.links.web ?? project.links.playStore ?? project.links.appStore;
          const visibleStack = project.stack.slice(0, 3);
          const remaining = project.stack.length - visibleStack.length;

          return (
            <Reveal
              key={project.slug}
              delay={i * 80}
              className="group flex flex-col gap-6 rounded-2xl p-4 -mx-4 transition-colors hover:bg-accent/[0.06] sm:flex-row sm:items-center"
            >
              <span className="font-display text-3xl font-medium leading-none text-accent/40 sm:self-start sm:pt-1 sm:text-4xl">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex-1">
                <div className="flex items-baseline gap-3 text-xs text-muted">
                  <span>{project.year}</span>
                  <span>{project.category}</span>
                </div>

                <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-1 text-muted">{project.tagline}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {visibleStack.map((tech) => (
                    <span key={tech} className="tag-pill">
                      {tech}
                    </span>
                  ))}
                  {remaining > 0 && <span className="text-xs text-muted">+{remaining} more</span>}
                </div>

                <p className="mt-4 text-sm text-muted">{project.metrics.join(" · ")}</p>

                <div className="mt-5 flex flex-wrap gap-6">
                  <Link
                    href={`/work/${project.slug}`}
                    className="link-underline text-sm font-medium text-foreground transition-colors hover:text-accent"
                  >
                    View Case Study →
                  </Link>
                  {liveHref && (
                    <a
                      href={liveHref}
                      className="link-underline text-sm text-muted transition-colors hover:text-foreground"
                    >
                      Live ↗
                    </a>
                  )}
                </div>
              </div>

              <div className="hidden w-48 shrink-0 sm:block">
                <FigurePlate
                  src={resolveProjectImage(project.images[0])}
                  alt={`${project.title} preview`}
                  index={i + 1}
                  label={project.title}
                  category={project.category}
                  tilt={i % 2 === 0 ? "left" : "right"}
                  className="transition-transform duration-300 ease-out group-hover:-translate-y-1"
                />
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
