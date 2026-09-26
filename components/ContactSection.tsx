import Magnetic from "@/components/Magnetic";
import { mailtoHref, site } from "@/lib/site";

export default function ContactSection() {
  const bookHref = site.calendlyUrl ?? mailtoHref("Project inquiry");

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="rounded-3xl bg-accent p-8 text-accent-foreground sm:p-12">
        <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Let&apos;s scope it.
        </h2>

        <div className="mt-8 space-y-2 text-accent-foreground/75">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em]">Open to</p>
          <p>Senior/Lead Remote Roles ($50K–$120K)</p>
          <p>Freelance &amp; Consulting (Upwork or direct)</p>
          <p>Architecture and Technical Advisory</p>
        </div>

        <a href={mailtoHref()} className="link-underline mt-8 inline-block font-medium">
          {site.email}
        </a>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.3}>
            <a
              href={bookHref}
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-transform duration-200 hover:-translate-y-0.5"
              {...(site.calendlyUrl
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {site.calendlyUrl ? "Book a 30-min call →" : "Email me →"}
            </a>
          </Magnetic>
          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-sm font-medium text-accent-foreground/90"
          >
            LinkedIn ↗
          </a>
        </div>

        <p className="mt-6 text-sm text-accent-foreground/75">{site.replySla}</p>
      </div>
    </section>
  );
}
