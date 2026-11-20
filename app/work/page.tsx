import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/data/projects";
import { resolveProjectImage } from "@/lib/projectImage";
import WorkFilter from "@/components/WorkFilter";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  alternates: { canonical: `${site.url}/work/` },
  description: "Mobile, web, and AI products shipped by Qasim Hassan Jaffry.",
};

export default function WorkPage() {
  const main = projects.filter((p) => !p.more);
  const more = projects.filter((p) => p.more);
  const images = Object.fromEntries(
    main.map((project) => [project.slug, resolveProjectImage(project.images[0])]),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <h1 className="hd text-5xl text-foreground sm:text-7xl">
        Work
      </h1>
      <p className="mt-2 text-muted">
        Products I own, lead, or built as part of a team. Each case study says which.
      </p>

      <WorkFilter projects={main} images={images} />

      {more.length > 0 && (
        <section className="mt-24 border-t border-border pt-12">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">More projects</h2>
          <p className="mt-2 text-muted">Earlier client work at StackUp Solutions and personal builds.</p>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {more.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[14rem_minmax(0,1fr)_auto] sm:items-baseline"
                >
                  <span className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
                    {p.title}
                  </span>
                  <span className="text-muted">{p.tagline}</span>
                  <span className="text-sm text-muted">{p.category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
