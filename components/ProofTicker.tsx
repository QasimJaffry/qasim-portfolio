const items = [
  "6+ years shipping",
  "60+ products shipped",
  "10K+ Play Store installs",
  "100% Upwork Job Success",
  "Top Rated Plus",
  "Live on Play Store & App Store",
];

export default function ProofTicker() {
  const row = (suffix: string) =>
    items.map((item) => (
      <span
        key={item + suffix}
        className="flex items-center gap-8 whitespace-nowrap pr-8 font-mono text-xs font-semibold uppercase tracking-[0.16em] sm:text-sm"
      >
        {item}
        <span aria-hidden className="text-base leading-none">
          ✦
        </span>
      </span>
    ));

  return (
    <section
      aria-label="Highlights"
      className="marquee overflow-hidden bg-accent py-3.5 text-accent-foreground"
    >
      <div className="marquee-track">
        <div className="flex">{row("a")}</div>
        <div className="flex" aria-hidden>
          {row("b")}
        </div>
      </div>
    </section>
  );
}
