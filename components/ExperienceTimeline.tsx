import { experience } from "@/lib/data/experience";
import Reveal from "@/components/Reveal";

export default function ExperienceTimeline() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <h2 className="eyebrow">Experience</h2>

      <div className="mt-8 space-y-12 border-l border-border pl-6">
        {experience.map((entry, i) => (
          <Reveal key={entry.company} delay={i * 80} className="group relative">
            <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full border-2 border-background bg-accent transition-transform duration-300 group-hover:scale-125" />

            <h3 className="font-display text-xl font-medium tracking-tight text-foreground">
              {entry.company}
            </h3>
            <p className="eyebrow mt-1.5 tracking-wide">
              {entry.role} · {entry.period}
            </p>
            <p className="mt-1 text-sm text-muted">{entry.location}</p>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              {entry.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {entry.stack.map((tech) => (
                <span key={tech} className="tag-pill">
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
