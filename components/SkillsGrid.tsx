import { skills } from "@/lib/data/skills";
import SectionLabel from "@/components/SectionLabel";

export default function SkillsGrid() {
  return (
    <section id="stack" className="scroll-mt-12 border-t border-border px-6 py-16 sm:px-10 sm:py-24">
      <SectionLabel n="04">Skills</SectionLabel>
      <h2 className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl">
        What I work with.
      </h2>

      <dl className="mt-10 divide-y divide-border border-y border-border">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="grid gap-3 py-5 sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-8">
            <dt className="text-sm font-semibold text-foreground">{category}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border px-3 py-1 text-xs text-foreground/85 transition-colors hover:border-accent hover:text-accent"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
