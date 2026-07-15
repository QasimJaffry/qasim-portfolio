import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/lib/data/projects";
import { resolveProjectImage } from "@/lib/projectImage";
import FigurePlate from "@/components/FigurePlate";

const linkLabels: Record<string, string> = {
  playStore: "Play Store",
  appStore: "App Store",
  web: "Website",
  github: "GitHub",
  demo: "Demo",
};

export default function CaseStudyLayout({
  project,
  children,
}: {
  project: Project;
  children: ReactNode;
}) {
  const linkEntries = Object.entries(project.links).filter(([, href]) => Boolean(href));
  const gallery = project.images
    .map((src) => resolveProjectImage(src))
    .filter((src): src is string => Boolean(src));

  const hero = gallery[0];
  const secondary = gallery.slice(1);

  return (
    <article className="pb-20 sm:pb-28">
      {/* Intro */}
      <div className="mx-auto max-w-5xl px-6 pt-16 sm:pt-24">
        <Link href="/work" className="text-sm text-muted transition-colors hover:text-foreground">
          ← Back to Work
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
          <span>{project.year}</span>
          <span aria-hidden>·</span>
          <span>{project.category}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                project.status === "Live" ? "bg-accent" : "bg-muted"
              }`}
            />
            {project.status}
          </span>
        </div>

        <h1 className="mt-3 max-w-3xl font-display text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted sm:text-xl">{project.tagline}</p>

        {project.metrics.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-border/70 py-5">
            {project.metrics.map((metric) => (
              <li key={metric} className="text-sm text-foreground">
                {metric}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hero showcase — full width within max */}
      {hero && (
        <div className="mx-auto mt-10 max-w-6xl animate-fade-up px-4 sm:mt-12 sm:px-6">
          <FigurePlate
            src={hero}
            alt={`${project.title} product showcase`}
            category={project.category}
            tilt="none"
            className="shadow-[0_24px_60px_-28px_rgba(21,24,26,0.35)]"
          />
        </div>
      )}

      {/* Body */}
      <div className="mx-auto mt-14 grid max-w-5xl gap-12 px-6 sm:mt-20 sm:grid-cols-[1fr_240px]">
        <div className="prose-case-study max-w-none text-muted [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2:first-child]:mt-0 [&_p]:mt-3 [&_p]:leading-relaxed">
          {children}
        </div>

        <aside className="h-fit space-y-6 sm:sticky sm:top-24">
          <div className="rounded-2xl bg-surface p-6 text-sm">
            <div>
              <h2 className="eyebrow">Status</h2>
              <p className="mt-2 text-foreground">{project.status}</p>
            </div>

            <div className="mt-6">
              <h2 className="eyebrow">Year</h2>
              <p className="mt-2 text-foreground">{project.year}</p>
            </div>

            <div className="mt-6">
              <h2 className="eyebrow">Stack</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="tag-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {linkEntries.length > 0 && (
              <div className="mt-6">
                <h2 className="eyebrow">Links</h2>
                <div className="mt-2 flex flex-col gap-2">
                  {linkEntries.map(([key, href]) => (
                    <a
                      key={key}
                      href={href}
                      className="text-foreground transition-colors hover:text-accent"
                    >
                      {linkLabels[key] ?? key} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Detail gallery */}
      {secondary.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:mt-28 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4 px-2">
            <div>
              <p className="eyebrow">Product screens</p>
              <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                Inside the build
              </h2>
            </div>
            <p className="hidden text-sm text-muted sm:block">
              {secondary.length === 1 ? "1 more view" : `${secondary.length} more views`}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {secondary.map((src, i) => (
              <div
                key={src}
                className={`animate-fade-up ${i === 0 && secondary.length === 3 ? "sm:col-span-2" : ""}`}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <FigurePlate
                  src={src}
                  alt={`${project.title} screen ${i + 2}`}
                  category={project.category}
                  index={i + 2}
                  label={i === 0 ? "Primary flow" : i === 1 ? "Supporting view" : "Detail"}
                  tilt={i % 2 === 0 ? "left" : "right"}
                  className="transition-transform duration-300 hover:-translate-y-1"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
