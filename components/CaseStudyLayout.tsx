import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/lib/data/projects";
import { resolveProjectImage } from "@/lib/projectImage";
import { getAdjacentCaseStudies } from "@/lib/projects";
import FigurePlate from "@/components/FigurePlate";

const linkLabels: Record<string, string> = {
  playStore: "Play Store",
  appStore: "App Store",
  web: "Website",
  github: "GitHub",
};

export default function CaseStudyLayout({
  project,
  children,
}: {
  project: Project;
  children: ReactNode;
}) {
  const linkEntries = Object.entries(project.links).filter(([, href]) => Boolean(href));
  const hero = resolveProjectImage(project.images[0]);
  const liveLinks = linkEntries.filter(([key]) => key !== "github");
  const { prev, next } = getAdjacentCaseStudies(project.slug);

  return (
    <article className="pb-24 sm:pb-32">
      <header className="mx-auto max-w-3xl px-6 pt-16 sm:pt-24">
        <Link
          href="/work"
          className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          Work
        </Link>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {project.year}
          <span className="mx-2.5 text-border">/</span>
          {project.category}
          <span className="mx-2.5 text-border">/</span>
          {project.status}
        </p>

        <div className="mt-4 flex items-start gap-4 sm:gap-5">
          {project.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveProjectImage(project.icon) ?? project.icon}
              alt=""
              width={72}
              height={72}
              className="mt-1 size-14 shrink-0 rounded-[18px] shadow-[0_12px_28px_-14px_rgba(21,24,26,0.45)] sm:mt-1.5 sm:size-[72px] sm:rounded-[20px]"
            />
          )}
          <div className="min-w-0">
            <h1 className="font-display text-[2.35rem] font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
              {project.title}
            </h1>
            <p className="mt-5 text-xl leading-snug text-foreground/80 sm:text-2xl sm:leading-snug">
              {project.tagline}
            </p>
          </div>
        </div>
      </header>

      {hero && (
        <div className="mx-auto mt-10 max-w-6xl animate-fade-up px-4 sm:mt-12 sm:px-6">
          <FigurePlate
            src={hero}
            alt={`${project.title}`}
            category={project.category}
            tilt="none"
            priority
            className="shadow-[0_28px_70px_-32px_rgba(21,24,26,0.4)]"
          />

          {liveLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 px-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                See it live
              </span>
              {liveLinks.map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-sm font-medium text-foreground transition-colors hover:text-accent"
                >
                  {linkLabels[key] ?? key} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {(project.description || project.metrics.length > 0) && (
        <div className="mx-auto mt-10 max-w-3xl px-6 sm:mt-12">
          {project.description && (
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
              {project.description}
            </p>
          )}
          {project.metrics.length > 0 && (
            <ul className="mt-8 space-y-2 border-l-2 border-accent/40 pl-4">
              {project.metrics.map((metric) => (
                <li key={metric} className="text-sm leading-snug text-foreground">
                  {metric}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mx-auto mt-16 grid max-w-5xl gap-14 px-6 sm:mt-24 lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-16">
        <div className="case-study-body">{children}</div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-8 border-t border-border/80 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <div>
              <h2 className="eyebrow">Stack</h2>
              <ul className="mt-3 space-y-1.5">
                {project.stack.map((tech) => (
                  <li key={tech} className="text-sm text-foreground">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            {linkEntries.length > 0 && (
              <div>
                <h2 className="eyebrow">Links</h2>
                <ul className="mt-3 space-y-2">
                  {linkEntries.map(([key, href]) => (
                    <li key={key}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-sm text-foreground"
                      >
                        {linkLabels[key] ?? key}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      <section className="mx-auto mt-20 max-w-3xl border-t border-border/80 px-6 pt-10 sm:mt-28">
        <p className="font-display text-xl font-medium tracking-tight text-foreground sm:text-2xl">
          Building something in this space?
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">
          I ship mobile, web, and AI product surfaces end-to-end — from product UI to payments and
          store releases.
        </p>
        <Link
          href="/#contact"
          className="mt-6 inline-flex link-underline text-sm font-medium text-foreground transition-colors hover:text-accent"
        >
          Get in touch →
        </Link>
      </section>

      {(prev || next) && (
        <nav
          aria-label="More work"
          className="mx-auto mt-16 max-w-5xl border-t border-border/80 px-6 pt-10 sm:mt-20"
        >
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
            {prev ? <AdjacentProject project={prev} direction="prev" /> : <div />}
            {next ? <AdjacentProject project={next} direction="next" /> : null}
          </div>
        </nav>
      )}
    </article>
  );
}

function AdjacentProject({
  project,
  direction,
}: {
  project: Project;
  direction: "prev" | "next";
}) {
  const thumb = resolveProjectImage(project.images[0]);
  const isNext = direction === "next";

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group flex gap-4 ${isNext ? "sm:flex-row-reverse sm:text-right" : ""}`}
    >
      {thumb && (
        <div className="w-28 shrink-0 overflow-hidden rounded-xl sm:w-32">
          <FigurePlate
            src={thumb}
            alt=""
            category={project.category}
            tilt="none"
            className="shadow-none transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
          />
        </div>
      )}
      <div className="min-w-0 flex-1 self-center">
        <p className="text-xs text-muted">{isNext ? "Next" : "Previous"}</p>
        <p className="mt-1 font-display text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-xl">
          {project.title}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{project.tagline}</p>
      </div>
    </Link>
  );
}
