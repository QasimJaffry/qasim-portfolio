import { skills } from "@/lib/data/skills";
import Reveal from "@/components/Reveal";

export default function SkillsGrid() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <p className="eyebrow text-accent">Stack</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-5xl">
          What I reach for.
        </h2>

        <dl className="mt-12 divide-y divide-border border-y border-border">
          {Object.entries(skills).map(([category, items], i) => (
            <Reveal
              key={category}
              delay={i * 40}
              className="grid gap-3 py-5 sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-8"
            >
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                {category}
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-foreground/85 transition-colors hover:border-accent hover:text-accent"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
