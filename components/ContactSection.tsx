import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <Reveal className="rounded-3xl bg-accent p-8 text-accent-foreground sm:p-12">
        <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Let&apos;s work together.
        </h2>

        <div className="mt-8 space-y-2 text-accent-foreground/75">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em]">Open to</p>
          <p>Senior/Lead Remote Roles ($50K–$120K)</p>
          <p>Freelance &amp; Consulting (Upwork or direct)</p>
          <p>Architecture and Technical Advisory</p>
        </div>

        <div className="mt-8 space-y-2">
          {/* TODO: placeholder — swap for real inbox */}
          <a href="mailto:hello@qasimhassan.dev" className="link-underline block font-medium">
            hello@qasimhassan.dev
          </a>
          <a
            href="https://linkedin.com/in/qasim-hassan-02871a171"
            className="link-underline block text-accent-foreground/75 transition-colors hover:text-accent-foreground"
          >
            linkedin.com/in/qasim-hassan-02871a171
          </a>
        </div>

        <Magnetic strength={0.3} className="mt-8">
          <a
            href="https://linkedin.com/in/qasim-hassan-02871a171"
            className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-transform duration-200 hover:-translate-y-0.5"
          >
            Send Message on LinkedIn →
          </a>
        </Magnetic>

        <p className="mt-6 text-sm text-accent-foreground/75">I respond within 24 hours.</p>
      </Reveal>
    </section>
  );
}
