import Link from "next/link";
import FeaturedProjects from "@/components/FeaturedProjects";
import WhatITakeOn from "@/components/WhatITakeOn";
import SkillsGrid from "@/components/SkillsGrid";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import MobileCta from "@/components/MobileCta";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Phone from "@/components/Phone";
import { getScreens } from "@/lib/screens";
import { mailtoHref, site } from "@/lib/site";

// The strongest screen or two from each app, alternating apps so the hero phone shows range.
const heroPicks: Array<[slug: string, app: string, screen: number]> = [
  ["innerverse", "Innerverse", 1],
  ["agenticly", "Agenticly", 4],
  ["kitty-nip", "Kitty Nip", 2],
  ["safedeal", "SafeDeal", 3],
  ["qubio", "Qubio", 3],
  ["bugmapper", "BugMapper", 3],
  ["innerverse", "Innerverse", 3],
  ["agenticly", "Agenticly", 3],
];
const heroPlaylist = () =>
  heroPicks.map(([slug, app, n]) => getScreens(slug, app)[n - 1]).filter(Boolean);

const proof = [
  ["100K+", "downloads on AI Maker Pro"],
  ["26K", "Agenticly installs"],
  ["9", "engineers led, at most"],
  ["100%", "crash-free on Kitty Nip"],
];

export default function Home() {
  return (
    <div className="mx-auto max-w-[90rem] px-6 sm:px-10">
      <section className="relative pt-8 sm:pt-12">
        <h1 className="hd whitespace-nowrap text-[calc((100vw-3rem)/6.7)] sm:text-[min(calc((100vw-5rem)/6.7),12.6rem)] leading-[0.85] tracking-[-0.055em] text-foreground">
          Qasim Hassan
        </h1>

        <div className="mt-10 grid items-start gap-12 md:grid-cols-[minmax(0,1fr)_17rem] lg:mt-0 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
          <div className="lg:pt-24">
            <p className="max-w-2xl font-display text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-[1.15] text-foreground">
              I own mobile and web products end to end, from first build to apps with 100K+ downloads.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-[1.6] text-foreground/70">
              Senior Full-Stack Engineer at Star Computer Labs, a US product team, and before that tech lead at
              StackUp Solutions. I own the clients, the Firebase backend and the billing, and I&apos;m the one
              trusted with what has to keep working after launch. {site.availability.status}.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href={mailtoHref("Project inquiry")} className="btn-primary px-8 py-4 text-base">
                Start a project
              </a>
              <div className="flex items-center gap-x-8">
                <Link href="#work" className="btn-secondary link-underline">
                  See the work
                </Link>
                <Link href="/resume" className="btn-secondary link-underline">
                  Resume
                </Link>
              </div>
            </div>

            <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 lg:grid-cols-4">
              {proof.map(([value, label]) => (
                <div key={label}>
                  <dt className="hd text-3xl text-foreground sm:text-4xl">{value}</dt>
                  <dd className="mt-1 text-sm leading-snug text-muted">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Phone
            screens={heroPlaylist()}
            caption
            priority
            interval={2200}
            className="relative z-10 mx-auto w-[15rem] md:w-full lg:-mt-[5vw] lg:w-[18rem]"
          />
        </div>
      </section>

      <div className="mt-28 space-y-32 pb-24 sm:mt-36 sm:space-y-44">
        <FeaturedProjects />
        <WhatITakeOn />
        <ExperienceTimeline />
        <SkillsGrid />
        <Testimonials />
        <FaqSection limit={3} />
        <ContactSection />
      </div>

      <MobileCta />
    </div>
  );
}
