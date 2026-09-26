import Link from "next/link";
import DeviceFrame from "@/components/DeviceFrame";
import { resolveProjectImage } from "@/lib/projectImage";
import { mailtoHref, site } from "@/lib/site";

export default function Hero() {
  const primary = resolveProjectImage("/images/projects/agenticly/hero.jpg");
  const secondary = resolveProjectImage("/images/projects/innerverse/hero.jpg");

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-14 sm:px-10 sm:pb-24 sm:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-20 h-[460px] w-[460px] rounded-full bg-accent/[0.13] blur-[120px]"
      />

      <p className="animate-fade-up relative font-mono text-sm tracking-[0.04em] text-muted">
        <span className="text-accent">const</span> me = <span className="text-foreground">&quot;builder&quot;</span>;
      </p>

      <h2
        className="animate-fade-up relative mt-5 max-w-3xl font-display text-[clamp(2.6rem,5.6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-foreground"
        style={{ animationDelay: "80ms" }}
      >
        I build apps people <span className="text-accent">install</span> and{" "}
        <span className="text-accent">pay</span> for.
      </h2>

      <p
        className="animate-fade-up relative mt-6 max-w-xl text-lg leading-relaxed text-muted"
        style={{ animationDelay: "140ms" }}
      >
        React Native, Next.js and AI features, from first sketch to App Store, Play Store and Stripe
        checkout. Mostly solo or in small teams.
      </p>

      <div
        className="animate-fade-up relative mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
        style={{ animationDelay: "200ms" }}
      >
        <a href="#work" className="btn-primary">
          See the work ↓
        </a>
        <a href={mailtoHref()} className="btn-secondary link-underline">
          Email me
        </a>
        <Link href="/resume" className="btn-secondary link-underline">
          Resume
        </Link>
      </div>

      {primary && (
        <div
          className="animate-fade-up relative mt-14 pb-12 sm:pb-16"
          style={{ animationDelay: "280ms" }}
        >
          <DeviceFrame
            src={primary}
            alt="Agenticly on laptop and phone"
            label="agenticly.app"
            priority
            sizes="(max-width: 1024px) 100vw, 760px"
            className="max-w-3xl"
          />
          {secondary && (
            <DeviceFrame
              src={secondary}
              alt="Innerverse mood galaxy app"
              sizes="320px"
              tilt={8}
              className="absolute -bottom-2 right-0 w-[44%] max-w-[320px] sm:right-6"
            />
          )}
        </div>
      )}

      <p className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        Now building{" "}
        <span className="text-foreground">{site.availability.currentlyBuilding.join(" · ")}</span>
      </p>
    </section>
  );
}
