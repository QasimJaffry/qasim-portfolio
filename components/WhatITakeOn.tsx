import { hireScopes } from "@/lib/data/scopes";
import { processSteps } from "@/lib/data/process";
import { AiDemo, PaymentsDemo } from "@/components/BentoDemos";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const scope = (start: string) => hireScopes.find((s) => s.title.startsWith(start))!;

const card = "flex flex-col rounded-3xl border border-border bg-surface/70 p-7 sm:p-8";

export default function WhatITakeOn() {
  const mobile = scope("mobile apps");
  const ai = scope("AI features");
  const mvp = scope("MVPs");
  const payments = scope("payments");
  const direction = scope("technical direction");
  const roles = scope("senior and lead");
  
  return (
    <section id="services" className="scroll-mt-16">
      <h2 className="hd text-[clamp(2.8rem,7vw,5.5rem)] text-foreground">Freelance: how I can help</h2>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <article className={`${card} md:col-span-2 lg:col-span-4`}>
          <h3 className="font-display text-2xl font-semibold text-foreground">{capitalize(payments.title)}</h3>
          <p className="mt-3 max-w-xl leading-[1.6] text-muted">{payments.description}</p>
          <PaymentsDemo />
        </article>

        <article className={`${card} lg:col-span-2`}>
          <h3 className="font-display text-2xl font-semibold text-foreground">{capitalize(ai.title)}</h3>
          <p className="mt-3 leading-[1.6] text-muted">{ai.description}</p>
          <AiDemo />
        </article>

        <article className={`${card} lg:col-span-2`}>
          <p className="hd text-7xl text-accent">10K–100K+</p>
          <p className="mt-2 text-muted">downloads on the live apps I own on Google Play and the App Store</p>
          <h3 className="mt-8 font-display text-2xl font-semibold text-foreground">{capitalize(mobile.title)}</h3>
          <p className="mt-3 leading-[1.6] text-muted">{mobile.description}</p>
        </article>

        <article className={`${card} md:col-span-2 lg:col-span-4`}>
          <h3 className="font-display text-2xl font-semibold text-foreground">Also on the table</h3>
          <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-3">
            {[mvp, direction, roles].map((s) => (
              <div key={s.title}>
                <dt className="font-display text-lg font-semibold text-foreground">{capitalize(s.title)}</dt>
                <dd className="mt-2 text-[15px] leading-[1.55] text-muted">{s.description}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article id="process" className={`${card} scroll-mt-16 md:col-span-2 lg:col-span-6`}>
          <h3 className="font-display text-2xl font-semibold text-foreground">How an engagement runs</h3>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, i) => (
              <li key={step.step}>
                <span className="hd text-4xl text-accent">{i + 1}</span>
                <h4 className="mt-2 font-display text-lg font-semibold text-foreground">{step.title}</h4>
                <p className="mt-1 text-[15px] leading-[1.55] text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}
