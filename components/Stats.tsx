import { stats } from "@/lib/data/stats";

/** The headline numbers as plain figures. */
export default function Stats() {
  return (
    <section aria-label="By the numbers" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className={`hd text-foreground ${stat.value.length > 6 ? "text-3xl" : "text-5xl"}`}>
              {stat.value}
            </dt>
            <dd className="mt-2 text-base text-muted">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
