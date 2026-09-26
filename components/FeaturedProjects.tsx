import Link from "next/link";
import { getFeaturedProjects, type Project } from "@/lib/data/projects";
import { resolveProjectImage } from "@/lib/projectImage";
import DeviceFrame from "@/components/DeviceFrame";
import Reveal from "@/components/Reveal";

function frameLabel(project: Project) {
  const url = project.links.web ?? project.links.playStore ?? project.links.appStore;
  if (!url) return project.title.toLowerCase();
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return project.title.toLowerCase();
  }
}

const storeLinks: Array<[keyof Project["links"], string]> = [
  ["playStore", "Google Play"],
  ["appStore", "App Store"],
  ["web", "Live site"],
];

export default function FeaturedProjects() {
  const featured = getFeaturedProjects();
  if (featured.length === 0) return null;

  return (
    <section id="featured-work" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-accent">Selected work</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.04em] text-foreground sm:text-6xl">
            Shipped, live, <br className="hidden sm:block" />
            and in people&apos;s pockets.
          </h2>
        </div>
        <Link
          href="/work"
          className="link-underline hidden shrink-0 pb-2 text-sm font-medium text-foreground sm:inline-block"
        >
          All work →
        </Link>
      </div>

      <div className="mt-16 space-y-24 sm:mt-24 sm:space-y-36">
        {featured.map((project, i) => {
          const image = resolveProjectImage(project.images[0]);
          const flip = i % 2 === 1;
          const links = storeLinks.filter(([key]) => project.links[key]);

          return (
            <Reveal key={project.slug}>
              <article className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                  {image && (
                    <Link href={`/work/${project.slug}`} className="block" aria-label={project.title}>
                      <DeviceFrame
                        src={image}
                        alt={`${project.title} preview`}
                        label={frameLabel(project)}
                        sizes="(max-width: 1024px) 100vw, 700px"
                        tilt={4}
                      />
                    </Link>
                  )}
                </div>

                <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                    <span className="text-accent">
                      {String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
                    </span>
                    <span className="mx-2.5 text-border">|</span>
                    {project.category}
                    <span className="mx-2.5 text-border">|</span>
                    {project.year}
                  </p>

                  <h3 className="mt-4 font-display text-5xl font-extrabold tracking-[-0.045em] text-foreground sm:text-6xl">
                    <Link
                      href={`/work/${project.slug}`}
                      className="transition-colors group-hover:text-accent"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-lg leading-snug text-foreground/85">{project.tagline}</p>

                  <ul className="mt-5 space-y-1.5 font-mono text-[13px] text-muted">
                    {project.metrics.map((metric) => (
                      <li key={metric} className="flex gap-2">
                        <span className="text-accent">▸</span>
                        {metric}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
                    >
                      Case study →
                    </Link>
                    {links.map(([key, label]) => (
                      <a
                        key={key}
                        href={project.links[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-20 text-center sm:hidden">
        <Link href="/work" className="link-underline text-sm font-medium text-foreground">
          All work →
        </Link>
      </div>
    </section>
  );
}
