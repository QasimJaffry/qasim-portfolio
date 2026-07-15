import type { Metadata } from "next";
import { projects } from "@/lib/data/projects";
import { resolveProjectImage } from "@/lib/projectImage";
import WorkFilter from "@/components/WorkFilter";

export const metadata: Metadata = {
  title: "Work",
  description: "Mobile, web, and AI products shipped by Qasim Hassan.",
};

export default function WorkPage() {
  const images = Object.fromEntries(
    projects.map((project) => [project.slug, resolveProjectImage(project.images[0])]),
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Work
      </h1>
      <p className="mt-2 text-muted">Twelve products, shipped across mobile, web, and AI.</p>

      <WorkFilter projects={projects} images={images} />
    </div>
  );
}
