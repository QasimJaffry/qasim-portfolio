import Reveal from "@/components/Reveal";
import { hireScopes } from "@/lib/data/scopes";
import { processSteps } from "@/lib/data/process";
import { mailtoHref } from "@/lib/site";

export default function WhatITakeOn() {
  return (
    <section id="hire" className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-accent">What I take on</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.04em] text-foreground sm:text-6xl">
                Bring me the messy middle.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted">
                The engagements that show up most: a mobile app that needs to exist, an AI feature
                that needs to survive real users, or a codebase that needs a straight answer.
              </p>
              <a href={mailtoHref("Project inquiry")} className="btn-primary mt-8">
                Start a conversation
              </a>
            </div>
          </Reveal>

          <ol className="lg:col-span-7">
            {hireScopes.map((scope, i) => (
              <Reveal key={scope.title} delay={i * 40}>
                <li className="group grid grid-cols-[3rem_1fr] gap-x-4 border-t border-border py-7 transition-colors last:border-b hover:border-accent">
                  <span className="pt-1 font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-2xl">
                      {scope.title}
                    </h3>
                    <p className="mt-2 max-w-xl leading-relaxed text-muted">{scope.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <div id="process" className="mt-24 sm:mt-32">
          <Reveal>
            <p className="eyebrow text-accent">How it goes</p>
            <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-4xl">
              First call to shipped.
            </h3>
          </Reveal>

          <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <span
              aria-hidden
              className="absolute left-0 right-0 top-[7px] hidden h-px bg-border lg:block"
            />
            {processSteps.map((item, i) => (
              <Reveal key={item.step} delay={i * 70}>
                <li className="relative">
                  <span className="relative z-10 block size-3.5 rounded-full border-2 border-accent bg-background" />
                  <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                    {item.step}
                  </p>
                  <h4 className="mt-2 text-xl font-bold tracking-tight text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.detail}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
