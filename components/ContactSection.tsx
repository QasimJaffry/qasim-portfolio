import Magnetic from "@/components/Magnetic";
import { mailtoHref, site } from "@/lib/site";

export default function ContactSection() {
  const bookHref = site.calendlyUrl ?? mailtoHref("Project inquiry");

  return (
    <section
      id="contact"
      className="scroll-mt-12 bg-accent px-6 py-16 text-accent-foreground sm:px-10 sm:py-24"
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
        $ ./contact.sh --open-to freelance,consulting,senior-remote
      </p>
      <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.055em]">
        Let&apos;s build
        <br />
        it properly.
      </h2>

      <a
        href={mailtoHref()}
        className="mt-10 inline-block break-all font-display text-2xl font-bold tracking-tight underline decoration-2 underline-offset-8 transition-opacity hover:opacity-70 sm:text-3xl"
      >
        {site.email}
      </a>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Magnetic strength={0.3}>
          <a
            href={bookHref}
            className="inline-flex items-center gap-2 rounded-full bg-accent-foreground px-7 py-3.5 text-sm font-semibold text-foreground transition-transform duration-200 hover:-translate-y-0.5"
            {...(site.calendlyUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {site.calendlyUrl ? "Book a 30-min call →" : "Email me →"}
          </a>
        </Magnetic>
        <a
          href={site.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-sm font-semibold"
        >
          LinkedIn ↗
        </a>
        <a
          href={site.social.upwork}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-sm font-semibold"
        >
          Upwork ↗
        </a>
      </div>

      <p className="mt-8 font-mono text-xs opacity-75">
        {site.replySla} · {site.location} · © {new Date().getFullYear()} Qasim Hassan
      </p>
    </section>
  );
}
