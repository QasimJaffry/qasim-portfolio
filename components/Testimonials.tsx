import Reveal from "@/components/Reveal";
import { testimonials } from "@/lib/data/testimonials";

export default function Testimonials() {
  return (
    <section id="proof" className="mx-auto max-w-6xl border-t border-border px-6 py-16 sm:py-24">
      <Reveal>
        <p className="eyebrow">What people say</p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Ownership, standards, and follow-through.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
        {testimonials.map((item, i) => (
          <Reveal
            key={item.name + item.role}
            delay={i * 70}
            className="flex flex-col border-t border-border/80 pt-6 md:border-t-0 md:border-l md:border-border/80 md:pl-6 md:pt-0 first:md:border-l-0 first:md:pl-0"
          >
            <blockquote className="flex-1 text-[15px] leading-relaxed text-muted">
              “{item.quote}”
            </blockquote>
            <footer className="mt-6">
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="mt-0.5 text-xs text-muted">
                {item.role}
                {item.source ? ` · ${item.source}` : ""}
              </p>
            </footer>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
