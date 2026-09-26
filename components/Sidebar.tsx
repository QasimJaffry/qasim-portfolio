import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { SidebarIndex } from "@/components/SectionNav";
import { mailtoHref, site } from "@/lib/site";

const facts = [
  ["Role", "Senior full-stack"],
  ["Based in", "Lahore, PK"],
  ["Experience", "6+ years"],
  ["Shipped", "60+ products"],
  ["Installs", "10K+ (Agenticly)"],
  ["Upwork", "100% JSS · Top Rated+"],
];

export default function Sidebar() {
  return (
    <aside
      id="top"
      className="flex flex-col gap-8 border-b border-border px-6 py-8 sm:px-10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:px-8 lg:py-10"
    >
      <div>
        <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/70" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          Open to work
        </p>

        <h1 className="mt-6 font-display text-[3.5rem] font-extrabold leading-[0.88] tracking-[-0.055em] text-foreground lg:text-[3.6rem]">
          Qasim
          <br />
          Hassan<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-accent">
          Mobile · Web · AI
        </p>
      </div>

      <dl className="space-y-2 text-sm">
        {facts.map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-2">
            <dt className="text-muted">{k}</dt>
            <span aria-hidden className="min-w-4 flex-1 border-b border-dotted border-border" />
            <dd className="text-right text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="hidden lg:block">
        <SidebarIndex />
      </div>

      <div className="mt-auto space-y-4">
        <ThemeToggle />
        <a href={mailtoHref()} className="btn-primary w-full justify-center">
          Email me →
        </a>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <a href={site.social.github} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-foreground">
            GitHub ↗
          </a>
          <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-foreground">
            LinkedIn ↗
          </a>
          <a href={site.social.upwork} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-foreground">
            Upwork ↗
          </a>
          <Link href="/resume" className="link-underline hover:text-foreground">
            Resume
          </Link>
        </div>
      </div>
    </aside>
  );
}
