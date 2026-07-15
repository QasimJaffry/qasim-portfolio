import { skills } from "@/lib/data/skills";
import Reveal from "@/components/Reveal";

export default function SkillsGrid() {
  return (
    <section className="mx-auto max-w-5xl border-t border-border px-6 pb-16 pt-10 sm:pb-24 sm:pt-14">
      <h2 className="eyebrow">Stack</h2>

      <div className="mt-8 divide-y divide-border border-t border-border">
        {Object.entries(skills).map(([category, items], i) => (
          <Reveal
            key={category}
            delay={i * 60}
            className="grid gap-1.5 py-5 transition-colors duration-200 hover:bg-accent/[0.05] sm:grid-cols-[160px_1fr] sm:items-baseline sm:gap-6 sm:-mx-4 sm:px-4 sm:rounded-xl"
          >
            <h3 className="font-display text-base font-medium tracking-tight text-foreground">
              {category}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{items.join(" · ")}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
