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
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <h1 className="hd text-5xl text-foreground sm:text-7xl">
        Work
      </h1>
      <p className="mt-2 text-muted">
        {projects.length} case studies across mobile, web and AI: products I own, lead, or built as part
        of a team. Each one says which.
      </p>

      <WorkFilter projects={projects} images={images} />
    </div>
  );
}
