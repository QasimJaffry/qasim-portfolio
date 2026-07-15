import type { Metadata } from "next";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Stats from "@/components/Stats";

export const metadata: Metadata = {
  title: "About",
  description: "Qasim Hassan — Senior Full-Stack Engineer based in Lahore, Pakistan.",
};

export default function AboutPage() {
  return (
    <>
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        About
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px] lg:gap-16">
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
            I&apos;ve worked across both freelance and long-term engagements: 100% Job Success on
            Upwork as a Top Rated Plus freelancer, an 18-month international client engagement on the
            Qubio ecosystem, and full-time work at StarComputer Labs where I lead architecture across
            mobile, web, payments, and AI. Alongside client work, I run Jafrix System, my own studio,
            where I&apos;ve built and published Innerverse and am currently developing Dealflow AI and
            Decidr.
          </p>
          <p>
            I hold a B.Sc. in Computer Science from COMSATS University, Lahore. Right now I&apos;m
            working through a structured AI curriculum (Level 1–5) while shipping updates to
            Innerverse.
          </p>
        </div>

        <aside className="h-fit space-y-8 rounded-2xl bg-surface p-6 text-sm lg:sticky lg:top-24">
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
        </aside>
      </div>
    </div>

    <Stats />
    <ExperienceTimeline />
    </>
  );
}
