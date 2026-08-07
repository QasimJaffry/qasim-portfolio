import { site } from "@/lib/site";

export default function AvailabilityStrip() {
  return (
    <section
      aria-label="Availability"
      className="border-y border-border/80 bg-surface/60"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="flex items-center gap-2.5 text-foreground">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span>
            <span className="font-medium">{site.availability.status}</span>
            <span className="text-muted"> · {site.replySla}</span>
          </span>
        </p>
        <p className="text-muted sm:text-right">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em]">Building</span>{" "}
          <span className="text-foreground">
            {site.availability.currentlyBuilding.join(" · ")}
          </span>
        </p>
      </div>
    </section>
  );
}
