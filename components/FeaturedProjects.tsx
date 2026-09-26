import Link from "next/link";
import { getFeaturedProjects, type Project } from "@/lib/data/projects";
import { resolveProjectImage } from "@/lib/projectImage";
import DeviceFrame from "@/components/DeviceFrame";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";

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
  ["playStore", "Play"],
  ["appStore", "App Store"],
  ["web", "Live"],
];

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const image = resolveProjectImage(project.images[0]);
  const links = storeLinks.filter(([key]) => project.links[key]);
  const lead = index === 0;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/40 transition-colors hover:border-accent/60 ${
        lead ? "md:col-span-2 md:grid md:grid-cols-[1.2fr_1fr]" : ""
      }`}
    >
      {image && (
        <Link
          href={`/work/${project.slug}`}
          aria-label={project.title}
          className="block p-3 sm:p-4"
        >
          <DeviceFrame
            src={image}
            alt={`${project.title} preview`}
            label={frameLabel(project)}
            sizes={lead ? "(max-width: 768px) 100vw, 520px" : "(max-width: 768px) 100vw, 420px"}
            tilt={4}
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5 pt-2 sm:p-6 sm:pt-2 md:pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span className="text-accent">
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
          <span className="mx-2 text-border">|</span>
          {project.category}
          <span className="mx-2 text-border">|</span>
          {project.year}
        </p>

        <h3
          className={`mt-3 font-display font-extrabold tracking-[-0.045em] text-foreground ${
            lead ? "text-5xl" : "text-4xl"
          }`}
        >
          <Link href={`/work/${project.slug}`} className="transition-colors group-hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 leading-snug text-foreground/80">{project.tagline}</p>

        <ul className="mt-4 space-y-1 font-mono text-[12.5px] text-muted">
          {project.metrics.slice(0, lead ? 3 : 2).map((metric) => (
            <li key={metric} className="flex gap-2">
              <span className="text-accent">▸</span>
              {metric}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 font-mono text-xs">
          <Link
            href={`/work/${project.slug}`}
            className="rounded-full bg-foreground px-4 py-2 font-sans text-[13px] font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            Case study →
          </Link>
          {links.map(([key, label]) => (
            <a
              key={key}
              href={project.links[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              {label} ↗
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProjects() {
  const featured = getFeaturedProjects();
  if (featured.length === 0) return null;

  return (
    <section id="work" className="scroll-mt-12 border-t border-border px-6 py-16 sm:px-10 sm:py-24">
      <SectionLabel n="01">Selected work</SectionLabel>
      <div className="mt-3 flex items-end justify-between gap-6">
        <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl">
          Shipped, live, and in people&apos;s pockets.
        </h2>
        <Link
          href="/work"
          className="link-underline hidden shrink-0 pb-2 text-sm font-medium text-foreground sm:inline-block"
        >
          All 16 projects →
        </Link>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 70} className={i === 0 ? "md:col-span-2" : ""}>
            <ProjectCard project={project} index={i} total={featured.length} />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 sm:hidden">
        <Link href="/work" className="link-underline font-mono text-xs text-foreground">
          All projects →
        </Link>
      </div>
    </section>
  );
}
