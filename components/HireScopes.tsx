import Reveal from "@/components/Reveal";
import { hireScopes } from "@/lib/data/scopes";

export default function HireScopes() {
  return (
    <section id="hire" className="mx-auto max-w-5xl border-t border-border px-6 py-16 sm:py-24">
      <Reveal>
        <p className="eyebrow">Hire me for</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          The problems clients and teams usually bring.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">
          Not a menu of buzzwords — the engagement shapes that show up in the highest-quality inbound.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {hireScopes.map((scope, i) => (
          <Reveal key={scope.title} delay={i * 50} className="border-t border-border/80 pt-5">
            <h3 className="font-display text-lg font-medium tracking-tight text-foreground">
              {scope.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">{scope.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
