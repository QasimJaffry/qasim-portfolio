import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>
            {site.name} · {site.location}
          </p>
          <a href={`mailto:${site.email}`} className="link-underline text-foreground">
            {site.email}
          </a>
        </div>
        <p className="sm:text-center">Built with Next.js</p>
        <div className="flex flex-wrap gap-4 sm:justify-end">
          <a href="/resume" className="link-underline transition-colors hover:text-foreground">
            Resume
          </a>
          <a
            href={site.social.github}
            className="link-underline transition-colors hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href={site.social.linkedin}
            className="link-underline transition-colors hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href={site.social.upwork}
            className="link-underline transition-colors hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Upwork
          </a>
        </div>
      </div>
    </footer>
  );
}
