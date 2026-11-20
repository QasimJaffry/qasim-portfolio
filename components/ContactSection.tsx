import CopyEmail from "@/components/CopyEmail";
import { mailtoHref, site } from "@/lib/site";

const link = "link-underline py-1 font-display text-[15px] font-semibold";

export default function ContactSection() {
  const bookHref = site.calendlyUrl ?? mailtoHref("Project inquiry");

  return (
    <section id="contact" className="scroll-mt-12 bg-accent text-accent-foreground">
      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10 sm:py-32">
        <h2 className="hd text-balance text-[clamp(3.4rem,11vw,10rem)] leading-[0.9] tracking-[-0.05em]">
          Hiring? Let&apos;s talk.
        </h2>
        <p className="mt-6 max-w-lg text-lg leading-[1.6] text-accent-foreground/75">
          {site.availability.status}. {site.replySla}
        </p>

        <a
          href={mailtoHref()}
          className="mt-10 inline-block break-all font-display text-3xl font-semibold underline decoration-accent-foreground/35 decoration-2 underline-offset-8 transition-colors hover:decoration-accent-foreground sm:text-5xl"
        >
          {site.email}
        </a>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={bookHref}
            className="inline-flex items-center rounded-md bg-accent-foreground px-7 py-3.5 font-display text-[15px] font-semibold text-foreground transition-colors hover:bg-surface"
            {...(site.calendlyUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {site.calendlyUrl ? "Book a 30-minute call" : "Email me"}
          </a>
          <CopyEmail email={site.email} />
          <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
            LinkedIn
          </a>
          <a href={site.social.github} target="_blank" rel="noopener noreferrer" className={link}>
            GitHub
          </a>
        </div>

        <p className="mt-20 text-sm text-accent-foreground/70">
          {site.location}. © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </section>
  );
}
