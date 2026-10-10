import { faqItems } from "@/lib/data/faq";

export default function FaqSection({ limit }: { limit?: number }) {
  const items = typeof limit === "number" ? faqItems.slice(0, limit) : faqItems;

  return (
    <section id="faq" className="scroll-mt-16 bg-surface px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-12">
        <h2 className="hd text-5xl text-foreground sm:text-7xl lg:col-span-5">Frequently asked questions.</h2>

        <div className="divide-y divide-foreground/15 border-y border-foreground/15 lg:col-span-6 lg:col-start-7">
          {items.map((item, i) => (
            <details key={item.question} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center text-2xl leading-none text-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-xl pb-6 text-lg leading-[1.55] text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
