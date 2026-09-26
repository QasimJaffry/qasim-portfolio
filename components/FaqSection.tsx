import Reveal from "@/components/Reveal";
import { faqItems } from "@/lib/data/faq";

export default function FaqSection({ limit }: { limit?: number }) {
  const items = typeof limit === "number" ? faqItems.slice(0, limit) : faqItems;

  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:py-28 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-accent">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-5xl">
            Straight answers.
          </h2>
        </Reveal>

        <div className="divide-y divide-border border-y border-border lg:col-span-8">
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
      </div>
    </section>
  );
}
