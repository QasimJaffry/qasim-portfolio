import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { hireScopes } from "@/lib/data/scopes";
import { processSteps } from "@/lib/data/process";
import { mailtoHref } from "@/lib/site";

const hashes = ["a1f3c9e", "b72d40a", "c58e1b7", "d94a06f"];

export default function WhatITakeOn() {
  return (
    <section id="services" className="scroll-mt-12 border-t border-border px-6 py-16 sm:px-10 sm:py-24">
      <SectionLabel n="02">services.md</SectionLabel>
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
        <SectionLabel n="03">git log --oneline</SectionLabel>
        <ol className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface/50 font-mono text-sm">
          {processSteps.map((item, i) => (
            <Reveal key={item.step} delay={i * 60}>
              <li className="grid gap-x-5 gap-y-1 border-b border-border px-5 py-5 last:border-b-0 sm:grid-cols-[5rem_10rem_1fr]">
                <span className="text-accent">{hashes[i] ?? item.step}</span>
                <span className="font-sans text-base font-bold text-foreground">
                  {item.title.toLowerCase()}
                </span>
                <span className="font-sans text-sm leading-relaxed text-muted">{item.detail}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
