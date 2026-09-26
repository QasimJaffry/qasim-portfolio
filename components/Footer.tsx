import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { label: "Work", href: "/work", external: false },
  { label: "About", href: "/about", external: false },
  { label: "Resume", href: "/resume", external: false },
  { label: "GitHub", href: site.social.github, external: true },
  { label: "LinkedIn", href: site.social.linkedin, external: true },
  { label: "Upwork", href: site.social.upwork, external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 text-sm text-muted sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="font-display text-lg font-bold tracking-tight text-foreground">
            Qasim Hassan<span className="text-accent">.</span>
          </p>
          <p>
            {site.title} · {site.location}
          </p>
          <a href={`mailto:${site.email}`} className="link-underline text-foreground">
            {site.email}
          </a>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline transition-colors hover:text-foreground"
              >
                {link.label} ↗
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="link-underline transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
