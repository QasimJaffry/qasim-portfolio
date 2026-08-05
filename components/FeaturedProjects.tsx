import Link from "next/link";
import { getFeaturedProjects } from "@/lib/data/projects";
import { resolveProjectImage } from "@/lib/projectImage";
import FigurePlate from "@/components/FigurePlate";
import Reveal from "@/components/Reveal";

export default function FeaturedProjects() {
  const featured = getFeaturedProjects();
  const [lead, ...rest] = featured;

  if (!lead) return null;

  const leadLive = lead.links.web ?? lead.links.playStore ?? lead.links.appStore;

  return (
    <section id="featured-work" className="mx-auto max-w-5xl px-6 pb-8 pt-16 sm:pb-12 sm:pt-24">
      <h2 className="eyebrow">Featured Work</h2>

      <Reveal className="mt-8">
        <article className="group">
          <Link href={`/work/${lead.slug}`} className="block">
            <FigurePlate
              src={resolveProjectImage(lead.images[0])}
              alt={`${lead.title} preview`}
              category={lead.category}
              tilt="none"
              className="shadow-[0_24px_60px_-36px_rgba(21,24,26,0.4)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
            />
          </Link>

          <div className="mt-6 max-w-2xl">
            <div className="flex items-baseline gap-3 text-xs text-muted">
              <span>{lead.year}</span>
              <span>{lead.category}</span>
            </div>
            <h3 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              <Link href={`/work/${lead.slug}`} className="transition-colors hover:text-accent">
                {lead.title}
              </Link>
            </h3>
            <p className="mt-2 text-lg text-muted">{lead.tagline}</p>
            <p className="mt-4 text-sm text-muted">{lead.metrics.join(" · ")}</p>
            <div className="mt-5 flex flex-wrap gap-6">
              <Link
                href={`/work/${lead.slug}`}
                className="link-underline text-sm font-medium text-foreground transition-colors hover:text-accent"
              >
                View Case Study →
              </Link>
              {leadLive && (
                <a
                  href={leadLive}
                  className="link-underline text-sm text-muted transition-colors hover:text-foreground"
                >
                  Live ↗
                </a>
              )}
            </div>
          </div>
        </article>
      </Reveal>

      {rest.length > 0 && (
        <div className="mt-14 divide-y divide-border/80 border-t border-border/80">
          {rest.map((project, i) => {
            const liveHref =
              project.links.web ?? project.links.playStore ?? project.links.appStore;
            const stack = project.stack.slice(0, 3).join(" · ");

            return (
              <Reveal
                key={project.slug}
                delay={(i + 1) * 70}
                className="group grid gap-5 py-8 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-center sm:gap-8"
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3 text-xs text-muted">
                    <span className="font-display text-lg font-medium text-accent/45">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <span>{project.year}</span>
                    <span>{project.category}</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-foreground">
                    <Link
                      href={`/work/${project.slug}`}
                      className="transition-colors hover:text-accent"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-muted">{project.tagline}</p>
                  <p className="mt-3 text-xs text-muted">{stack}</p>
                  <div className="mt-4 flex flex-wrap gap-6">
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

                <Link href={`/work/${project.slug}`} className="block w-full sm:w-auto">
                  <FigurePlate
                    src={resolveProjectImage(project.images[0])}
                    alt={`${project.title} preview`}
                    index={i + 2}
                    category={project.category}
                    tilt="none"
                    className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
                  />
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/work"
          className="link-underline text-sm font-medium text-foreground transition-colors hover:text-accent"
        >
          View all work →
        </Link>
      </div>
    </section>
  );
}
