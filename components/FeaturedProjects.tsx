import { getFeaturedProjects } from "@/lib/data/projects";
import { resolveProjectImage } from "@/lib/projectImage";
import Showcase, { type ShowcaseItem } from "@/components/Showcase";

/** Prepares the featured projects for the pinned showcase that opens the page. */
export default function FeaturedProjects() {
  const featured = getFeaturedProjects();
  if (featured.length === 0) return null;

  const items: ShowcaseItem[] = featured.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    category: p.category,
    year: p.year,
    metrics: p.metrics.slice(0, 2),
    image: resolveProjectImage(p.images[0]) ?? null,
  }));

  return <Showcase items={items} />;
}
