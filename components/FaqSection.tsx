import SectionLabel from "@/components/SectionLabel";
import { faqItems } from "@/lib/data/faq";

export default function FaqSection({ limit }: { limit?: number }) {
  const items = typeof limit === "number" ? faqItems.slice(0, limit) : faqItems;

  return (
    <section id="faq" className="scroll-mt-12 border-t border-border px-6 py-16 sm:px-10 sm:py-24">
      <SectionLabel n="05">faq.md</SectionLabel>
      <h2 className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl">
        Straight answers.
      </h2>

      <div className="mt-10 divide-y divide-border border-y border-border">
          {items.map((item, i) => (
            <details key={item.question} className="group py-1" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold tracking-tight text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border font-mono text-lg leading-none text-accent transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
    </section>
  );
}
