import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { hireScopes } from "@/lib/data/scopes";
import { processSteps } from "@/lib/data/process";
import { mailtoHref } from "@/lib/site";

export default function WhatITakeOn() {
  return (
    <section id="services" className="scroll-mt-12 border-t border-border px-6 py-16 sm:px-10 sm:py-24">
      <SectionLabel n="02">Services</SectionLabel>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
        <h2 className="max-w-xl font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl">
          Bring me the messy middle.
        </h2>
        <a href={mailtoHref("Project inquiry")} className="btn-primary">
          Start a conversation
        </a>
      </div>

      <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
        {hireScopes.map((scope, i) => (
          <li
            key={scope.title}
            className="group relative bg-background p-6 transition-colors hover:bg-surface"
          >
            <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-6 text-xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-accent">
              {scope.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{scope.description}</p>
          </li>
        ))}
      </ul>

      <div id="process" className="mt-20">
        <SectionLabel n="03">How I work</SectionLabel>
        <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-4xl">
          From first call to shipped.
        </h3>

        <ol className="relative mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-border xl:block" />
          {processSteps.map((item, i) => (
            <Reveal key={item.step} delay={i * 60}>
              <li className="relative">
                <span className="relative z-10 block size-3.5 rounded-full border-2 border-accent bg-background" />
                <p className="mt-4 text-xs font-semibold text-accent">Step {item.step}</p>
                <h4 className="mt-1 text-lg font-bold tracking-tight text-foreground">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.detail}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
