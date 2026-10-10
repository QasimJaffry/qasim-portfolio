import { skills } from "@/lib/data/skills";

export default function SkillsGrid() {
  return (
    <section id="stack" className="scroll-mt-16 bg-surface px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[88rem]">
        <h2 className="hd text-5xl text-foreground sm:text-7xl">Skills and tools.</h2>

        <dl className="mt-16 grid gap-x-14 gap-y-12 md:grid-cols-2 xl:grid-cols-3 [&>div]:transition-opacity [&>div]:duration-300 [&:hover>div:not(:hover)]:opacity-35">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <dt className="hd text-3xl text-foreground">{category}</dt>
              <dd className="mt-3 max-w-md text-xl leading-[1.6] text-muted">{items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
