import { experience } from "@/lib/data/experience";

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="scroll-mt-20">
      <h2 className="hd text-[clamp(2.8rem,7vw,5.5rem)] text-foreground">Experience</h2>
      <ol className="mt-12 divide-y divide-border border-y border-border">
        {experience.map((e) => (
          <li key={e.company + e.period} className="grid gap-x-10 gap-y-2 py-8 md:grid-cols-[10rem_minmax(0,1fr)] lg:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1.2fr)]">
            <p className="pt-1 text-sm text-muted">{e.period}</p>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {e.company}
              </h3>
              <p className="mt-1 text-muted">{e.role}</p>
            </div>
            <div className="md:col-start-2 lg:col-start-auto">
              <p className="leading-[1.6] text-foreground/75">{e.description}</p>
              <p className="mt-3 text-sm text-foreground/60">{e.stack.join(", ")}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
