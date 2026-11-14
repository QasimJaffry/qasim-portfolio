import { skills } from "@/lib/data/skills";

export default function SkillsGrid() {
  return (
    <section id="stack" className="scroll-mt-20">
      <h2 className="hd text-[clamp(2.8rem,7vw,5.5rem)] text-foreground">Skills and tools</h2>
      <dl className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <dt className="font-display text-2xl font-semibold text-foreground">{category}</dt>
            <dd className="mt-2 text-lg leading-[1.6] text-muted">{items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
