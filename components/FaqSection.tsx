import { faqItems } from "@/lib/data/faq";

export default function FaqSection({ limit }: { limit?: number }) {
  const items = typeof limit === "number" ? faqItems.slice(0, limit) : faqItems;

  return (
    <section id="faq" className="scroll-mt-20">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <h2 className="hd text-[clamp(2.8rem,7vw,5.5rem)] text-foreground">Questions people ask</h2>
      <div className="divide-y divide-border border-y border-border">
        {items.map((item, i) => (
          <details key={item.question} className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
              {item.question}
              <span aria-hidden className="text-2xl leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="max-w-xl pb-6 text-lg leading-[1.6] text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
      </div>
    </section>
  );
}
