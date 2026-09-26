import Link from "next/link";
import DeviceFrame from "@/components/DeviceFrame";
import { resolveProjectImage } from "@/lib/projectImage";
import { mailtoHref, site } from "@/lib/site";

export default function Hero() {
  const primary = resolveProjectImage("/images/projects/agenticly/hero.jpg");
  const secondary = resolveProjectImage("/images/projects/innerverse/hero.jpg");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-accent/[0.14] blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-16 pt-10 sm:pb-24 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
        <div>
          <p className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/70" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Open to work · {site.location}
          </p>

          <h1
            className="animate-fade-up mt-7 font-display text-[clamp(3.75rem,10vw,9rem)] font-extrabold leading-[0.86] tracking-[-0.055em] text-foreground"
            style={{ animationDelay: "80ms" }}
          >
            Qasim
            <br />
            Hassan
            <span className="text-accent">.</span>
          </h1>

          <div className="animate-fade-up mt-9" style={{ animationDelay: "160ms" }}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Mobile · Web · AI
            </p>
            <p className="mt-3 max-w-md text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
              I build apps people install and pay for — React Native, Next.js and AI.
            </p>
            <p className="mt-3 max-w-md leading-relaxed text-muted">
              Senior full-stack engineer. I take a product from first sketch to the App Store,
              Play Store and Stripe checkout, mostly on my own or in small teams.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="#featured-work" className="btn-primary">
                See the work ↓
              </a>
              <a href={mailtoHref()} className="btn-secondary link-underline">
                Email me
              </a>
              <Link href="/resume" className="btn-secondary link-underline">
                Resume
              </Link>
            </div>

            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Now building{" "}
              <span className="text-foreground">
                {site.availability.currentlyBuilding.join(" · ")}
              </span>
            </p>
          </div>
        </div>

        {primary && (
          <div className="animate-fade-up relative pb-12 sm:pb-16" style={{ animationDelay: "240ms" }}>
            <DeviceFrame
              src={primary}
              alt="Agenticly on laptop and phone"
              label="agenticly.app"
              priority
              sizes="(max-width: 1024px) 100vw, 640px"
            />
            {secondary && (
              <DeviceFrame
                src={secondary}
                alt="Innerverse mood galaxy app"
                label="innerverse"
                sizes="320px"
                tilt={8}
                className="absolute -bottom-2 -left-2 w-[52%] sm:-left-8 sm:w-[44%]"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
