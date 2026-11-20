import Link from "next/link";
import FeaturedProjects from "@/components/FeaturedProjects";
import SkillsGrid from "@/components/SkillsGrid";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import MobileCta from "@/components/MobileCta";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { mailtoHref, site } from "@/lib/site";
import { withBasePath } from "@/lib/projectImage";

const proof = [
  ["100K+", "downloads on AI Maker Pro"],
  ["26K", "Agenticly installs, web + Android + iOS"],
];

export default function Home() {
  return (
    <>
    <div className="mx-auto max-w-[90rem] px-6 sm:px-10">
      <section className="relative pt-8 sm:pt-12">
        <h1 className="relative z-20 hd text-[calc((100vw-3rem)/6.7)] sm:whitespace-nowrap sm:text-[min(calc((100vw-5rem)/9.3),9.2rem)] leading-[0.85] tracking-[-0.055em] text-foreground">
          Qasim Hassan Jaffry
        </h1>

        <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
          <p className="max-w-2xl font-display text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-[1.15] text-foreground">
              I own mobile and web products end to end, from first build to apps with 100K+ downloads.
          </p>
          <div>
            <p className="max-w-xl text-lg leading-[1.6] text-foreground/70">
              Senior Full-Stack Engineer at Star Computer Labs, a US product team, and before that tech lead at
              StackUp Solutions. I own the clients, the Firebase backend and the billing, and I&apos;m the one
              trusted with what has to keep working after launch. {site.availability.status}.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href={withBasePath(site.availability.cv)} download className="btn-primary px-8 py-4 text-base">
                Download CV
              </a>
              <div className="flex items-center gap-x-8">
                <a href={mailtoHref("Senior role")} className="btn-secondary link-underline">
                  Email me
                </a>
                <Link href="#work" className="btn-secondary link-underline">
                  See the work
                </Link>
              </div>
            </div>

            <div className="mt-14 max-w-2xl border-t border-border pt-8">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-6">
                {proof.map(([value, label]) => (
                  <div key={label}>
                    <dt className="hd text-4xl text-foreground sm:text-5xl">{value}</dt>
                    <dd className="mt-1 text-sm leading-snug text-muted">{label}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-base leading-snug text-foreground/70">
                Led up to 9 engineers at StackUp Solutions. 99.9%+ crash-free on Kitty Nip after the React Native 0.79
                upgrade.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-20 space-y-24 pb-24 sm:mt-36 sm:space-y-44">
        <FeaturedProjects />
        <ExperienceTimeline />
        <SkillsGrid />
        <Testimonials />
        <FaqSection limit={3} />
      </div>

      <MobileCta />
    </div>
    <ContactSection />
    </>
  );
}
