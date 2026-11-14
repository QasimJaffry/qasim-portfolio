import Link from "next/link";
import { getFeaturedProjects, projects } from "@/lib/data/projects";
import { appTint, getScreens } from "@/lib/screens";
import WorkStory, { type StoryItem } from "@/components/WorkStory";

export default function FeaturedProjects() {
  const items: StoryItem[] = getFeaturedProjects().map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    category: p.category,
    year: p.year,
    metrics: p.metrics,
    screens: getScreens(p.slug, p.title),
    tint: appTint[p.slug] ?? "#60a5fa",
  }));
  if (items.length === 0) return null;

  return (
    <section id="work" className="scroll-mt-16">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-12">
        <h2 className="hd text-[clamp(2.8rem,7vw,5.5rem)] text-foreground">Selected work</h2>
        <Link href="/work" className="btn-secondary link-underline">
          All {projects.length} projects
        </Link>
      </div>
      <WorkStory items={items} />
    </section>
  );
}
