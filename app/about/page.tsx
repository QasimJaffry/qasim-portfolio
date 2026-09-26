import type { Metadata } from "next";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Stats from "@/components/Stats";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} — ${site.title} based in Lahore, Pakistan.`,
};

const aboutProof = [
  { value: "6+", label: "Years shipping" },
  { value: "60+", label: "Products shipped" },
  { value: "100%", label: "Upwork Job Success" },
  { value: "18 mo", label: "Longest client engagement" },
];

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            About
          </h1>
          <p className="mt-3 max-w-xl text-muted">{site.positioning}</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {aboutProof.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border/80 bg-surface/65 px-4 py-4">
              <p className="font-display text-2xl font-medium tracking-tight text-foreground">{item.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_280px] md:gap-12 lg:gap-16">
          <div className="max-w-2xl space-y-5 leading-relaxed text-muted">
            <p>
              I&apos;m a Senior Full-Stack Engineer based in Lahore, Pakistan, with 6+ years building
              mobile and web products end to end — architecture, frontend, backend, payments, and
              increasingly, AI integrations. Most of that time has been spent owning products
              completely rather than working on isolated pieces of someone else&apos;s system.
            </p>
            <p>
              My core stack is React Native and Next.js on the frontend, with Node.js, FastAPI, and
              PostgreSQL on the backend. Over the last two years that&apos;s expanded into applied AI —
              integrating the OpenAI and Claude APIs into production products, and working with
              computer vision models like YOLO11, SAM2, and DINOv2 on real-time pipelines.
            </p>
            <p>
              Day to day I work AI-assisted in Cursor and Claude to move faster on exploration,
              scaffolding, and refactors. Architecture, reviews, edge cases, and what ships still
              stay mine.
            </p>
            <p>
              I&apos;ve worked across both freelance and long-term engagements: 100% Job Success on
              Upwork as a Top Rated Plus freelancer, an 18-month international client engagement on the
              Qubio ecosystem, and full-time work at StarComputer Labs where I lead architecture across
              mobile, web, payments, and AI. Across freelance and studio work I&apos;ve shipped{" "}
              <span className="font-medium text-foreground">60+ products</span>
              — this site focuses on a selected set of case studies. Alongside client work, I run
              Jafrix System, my own studio, where I&apos;ve built and published Innerverse and am
              currently developing Dealflow AI and Decidr.
            </p>
            <p>
              I hold a B.Sc. in Computer Science from COMSATS University, Lahore. Right now I&apos;m
              working through a structured AI curriculum (Level 1–5) while shipping updates to
              Innerverse.
            </p>
          </div>

          <aside className="h-fit space-y-8 rounded-2xl bg-surface p-6 text-sm md:sticky md:top-24">
            <div>
              <h2 className="eyebrow">Education</h2>
              <p className="mt-3 text-foreground">B.Sc. Computer Science</p>
              <p className="text-muted">COMSATS University, Lahore</p>
            </div>

            <div>
              <h2 className="eyebrow">Available For</h2>
              <div className="mt-3 space-y-1.5 text-muted">
                <p>Senior/Lead Remote Roles ($50K–$120K)</p>
                <p>Architecture Consulting</p>
                <p>High-Value Freelance</p>
              </div>
            </div>

            <div>
              <h2 className="eyebrow">Resume</h2>
              <a href="/resume" className="mt-3 inline-block link-underline text-foreground">
                View printable resume →
              </a>
            </div>
          </aside>
        </div>
      </div>

      <Stats />
      <ExperienceTimeline />
    </>
  );
}
