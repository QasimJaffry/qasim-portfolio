import { skills } from "@/lib/data/skills";
import SectionLabel from "@/components/SectionLabel";

export default function SkillsGrid() {
  const entries = Object.entries(skills);

  return (
    <section id="stack" className="scroll-mt-12 border-t border-border px-6 py-16 sm:px-10 sm:py-24">
      <SectionLabel n="04">package.json</SectionLabel>
      <h2 className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl">
        What I reach for.
      </h2>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-surface/60 p-5 font-mono text-[13px] leading-7 sm:p-7">
        <div className="text-muted">{"{"}</div>
        <div className="pl-[2ch]">
          <span className="text-accent">&quot;name&quot;</span>
          <span className="text-muted">: </span>
          <span className="text-foreground">&quot;qasim-hassan&quot;</span>
          <span className="text-muted">,</span>
        </div>
        <div className="pl-[2ch]">
          <span className="text-accent">&quot;stack&quot;</span>
          <span className="text-muted">: {"{"}</span>
        </div>
        {entries.map(([category, items], i) => (
          <div key={category} className="pl-[8ch] -indent-[4ch]">
            <span className="text-accent">&quot;{category.toLowerCase()}&quot;</span>
            <span className="text-muted">: [</span>
            {items.map((item, j) => (
              <span key={item}>
                <span className="text-foreground">&quot;{item}&quot;</span>
                {j < items.length - 1 && <span className="text-muted">, </span>}
              </span>
            ))}
            <span className="text-muted">]{i < entries.length - 1 ? "," : ""}</span>
          </div>
        ))}
        <div className="pl-[2ch] text-muted">{"}"}</div>
        <div className="text-muted">{"}"}</div>
      </div>
    </section>
  );
}
