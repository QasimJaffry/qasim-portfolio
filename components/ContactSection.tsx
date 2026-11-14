import CopyEmail from "@/components/CopyEmail";
import { mailtoHref, site } from "@/lib/site";

export default function ContactSection() {
  const bookHref = site.calendlyUrl ?? mailtoHref("Project inquiry");

  return (
    <section id="contact" className="scroll-mt-20">
      <h2 className="hd text-balance text-[clamp(3.4rem,11vw,10rem)] leading-[0.9] tracking-[-0.05em] text-foreground">Let&apos;s build your app.</h2>
      <p className="mt-5 max-w-lg text-lg leading-[1.6] text-muted">
        Open to freelance projects, consulting and senior remote roles. {site.replySla}
      </p>

      <a
        href={mailtoHref()}
        className="mt-10 inline-block break-all font-display text-3xl font-semibold text-accent underline decoration-accent/40 decoration-2 underline-offset-8 transition-colors hover:decoration-accent sm:text-5xl"
      >
        {site.email}
      </a>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <a
          href={bookHref}
          className="btn-primary"
          {...(site.calendlyUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {site.calendlyUrl ? "Book a 30-minute call" : "Email me"}
        </a>
        <CopyEmail email={site.email} />
        <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline py-1 font-display text-[15px] font-medium">
          LinkedIn
        </a>
        <a href={site.social.github} target="_blank" rel="noopener noreferrer" className="link-underline py-1 font-display text-[15px] font-medium">
          GitHub
        </a>
      </div>

      <p className="mt-20 text-sm text-muted">
        {site.location}. © {new Date().getFullYear()} Qasim Hassan
      </p>
    </section>
  );
}
