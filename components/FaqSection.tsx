import Reveal from "@/components/Reveal";
import { faqItems } from "@/lib/data/faq";

export default function FaqSection({ limit }: { limit?: number }) {
  const items = typeof limit === "number" ? faqItems.slice(0, limit) : faqItems;

  return (
    <section id="faq" className="mx-auto max-w-6xl border-t border-border px-6 py-16 sm:py-24">
      <Reveal>
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Straight answers before the email.
        </h2>
      </Reveal>

      <div className="mt-12 divide-y divide-border border-t border-border">
        {items.map((item, i) => (
          <Reveal key={item.question} delay={i * 40} className="py-6 sm:grid sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)] sm:gap-10">
            <h3 className="font-display text-lg font-medium tracking-tight text-foreground">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:mt-0 sm:text-[15px]">
              {item.answer}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
