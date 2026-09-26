import Reveal from "@/components/Reveal";
import { processSteps } from "@/lib/data/process";

export default function ProcessSection() {
  return (
    <section id="process" className="mx-auto max-w-6xl border-t border-border px-6 py-16 sm:py-24">
      <Reveal>
        <p className="eyebrow">How I work</p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          From first call to shipped.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
          AI-assisted where it helps, with human review before anything lands.
        </p>
      </Reveal>

      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {processSteps.map((item, i) => (
          <Reveal key={item.step} delay={i * 60} className="relative">
            <li>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{item.step}</p>
              <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.detail}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
