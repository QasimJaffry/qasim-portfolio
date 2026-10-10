import Magnetic from "@/components/Magnetic";
import CopyEmail from "@/components/CopyEmail";
import { mailtoHref, site } from "@/lib/site";

export default function ContactSection() {
  const bookHref = site.calendlyUrl ?? mailtoHref("Project inquiry");

  return (
    <section id="contact" className="scroll-mt-12 bg-accent px-6 py-24 text-accent-foreground sm:px-10 sm:py-36">
      <div className="mx-auto max-w-[88rem]">
        <h2 className="hd text-[clamp(3.3rem,10vw,9.5rem)] leading-[0.96]">Let&apos;s talk about your project.</h2>

        <p className="mt-8 max-w-xl text-xl leading-[1.55] text-accent-foreground/75">
          Open to freelance projects, consulting and senior remote roles. {site.replySla}
        </p>

        <a
          href={mailtoHref()}
          className="mt-12 inline-block break-all font-display text-2xl font-semibold underline decoration-accent-foreground/40 decoration-2 underline-offset-8 transition-colors hover:decoration-accent-foreground sm:text-4xl"
        >
          {site.email}
        </a>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Magnetic strength={0.3}>
            <a
              href={bookHref}
              className="inline-flex items-center rounded-md bg-accent-foreground px-7 py-3.5 font-display text-[15px] font-semibold text-foreground transition-colors hover:bg-surface"
              {...(site.calendlyUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {site.calendlyUrl ? "Book a 30-minute call" : "Email me"}
            </a>
          </Magnetic>
          <CopyEmail email={site.email} />
          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-display text-[15px] font-medium"
          >
            LinkedIn
          </a>
          <a
            href={site.social.upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-display text-[15px] font-medium"
          >
            Upwork
          </a>
        </div>

        <p className="mt-16 text-sm text-accent-foreground/60">
          {site.location}. © {new Date().getFullYear()} Qasim Hassan
        </p>
      </div>
    </section>
  );
}
