import type { Metadata } from "next";
import Link from "next/link";
import ResumePrintButton from "@/components/ResumePrintButton";
import { experience } from "@/lib/data/experience";
import { resumeProjects, resumeSkills, resumeSummary } from "@/lib/data/resume";
import { mailtoHref, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume — ${site.name}, ${site.title}. React Native, Next.js, AI products.`,
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 print:max-w-none print:px-0 print:py-0">
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            Home
          </Link>
          <h1 className="mt-8 font-display text-4xl font-extrabold tracking-[-0.04em] text-foreground sm:text-5xl">
            Resume
          </h1>
          <p className="mt-2 text-sm text-muted">
            ATS-oriented single-column layout. Use Print → Save as PDF for applications.
          </p>
        </div>
        <ResumePrintButton />
      </div>

      <article className="mt-10 space-y-8 border-t border-border pt-10 text-[15px] leading-relaxed text-foreground print:mt-0 print:space-y-6 print:border-0 print:pt-0 print:text-[12.5px] print:leading-snug">
        <header>
          <h2 className="font-display text-3xl font-medium tracking-tight print:text-2xl">
            {site.name}
          </h2>
          <p className="mt-1 text-base font-medium text-foreground print:text-sm">{site.title}</p>
          <p className="mt-2 text-sm text-muted print:text-[11px]">
            {site.location} · Open to remote ·{" "}
            <a href={mailtoHref()} className="text-foreground">
              {site.email}
            </a>{" "}
            ·{" "}
            <a href={site.url} className="text-foreground">
              qasimhassan.dev
            </a>{" "}
            ·{" "}
            <a href={site.social.linkedin} className="text-foreground">
              LinkedIn
            </a>{" "}
            ·{" "}
            <a href={site.social.github} className="text-foreground">
              GitHub
            </a>
          </p>
        </header>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            Summary
          </h3>
          <p className="mt-2 text-muted print:text-[12px]">{resumeSummary}</p>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            Skills
          </h3>
          <ul className="mt-3 space-y-1.5">
            {Object.entries(resumeSkills).map(([category, items]) => (
              <li key={category} className="text-sm text-muted print:text-[11.5px]">
                <span className="font-medium text-foreground">{category}:</span> {items.join(", ")}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            Experience
          </h3>
          <ul className="mt-4 space-y-6 print:space-y-4">
            {experience.map((job) => (
              <li key={job.company + job.period}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-medium text-foreground">
                    {job.role} · {job.company}
                  </p>
                  <p className="text-xs text-muted print:text-[10px]">{job.period}</p>
                </div>
                <p className="mt-0.5 text-sm text-muted print:text-[11px]">
                  {job.location} · {job.type}
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-accent print:space-y-1 print:text-[11.5px]">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            Selected Projects
          </h3>
          <ul className="mt-3 space-y-3 print:space-y-2">
            {resumeProjects.map((project) => (
              <li key={project.name}>
                <p className="font-medium text-foreground">{project.name}</p>
                <p className="mt-0.5 text-sm text-muted print:text-[11.5px]">{project.line}</p>
                <p className="mt-0.5 text-xs text-muted print:text-[10px]">{project.stack}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            Education
          </h3>
          <p className="mt-2 text-sm text-foreground print:text-[12px]">
            B.Sc. Computer Science · COMSATS University, Lahore · 2016 – 2020
          </p>
        </section>
      </article>
    </div>
  );
}
