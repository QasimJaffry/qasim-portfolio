import type { Metadata } from "next";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { stats } from "@/lib/data/stats";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name}, ${site.title} in Lahore, Pakistan. Apps with 10K+ and 100K+ downloads, teams of up to nine.`,
};


export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <div>
          <h1 className="hd text-5xl text-foreground sm:text-7xl">
            About
          </h1>
          <p className="mt-3 max-w-xl text-muted">{site.positioning}</p>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_280px] md:gap-12 lg:gap-16">
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
            <p className="text-foreground">
              Senior React Native and Next.js engineer. I take mobile and web products from first build to live
              release, and I have owned apps with 10K+ and 100K+ downloads on Google Play and the App Store.
            </p>
            <div>
              <p>What I am usually trusted with:</p>
              <ul className="mt-3 space-y-2 pl-5 marker:text-accent [list-style:square]">
                <li>Subscriptions and payments: RevenueCat, Stripe, store billing</li>
                <li>Offline-first mobile apps: Expo, Firebase, Supabase</li>
                <li>LLM-backed features in production: OpenAI, Claude API, AWS Bedrock</li>
                <li>
                  Releases and upgrades: React Native 0.79 on the New Architecture, 16 KB page-size support,
                  Android and iOS store submissions
                </li>
              </ul>
            </div>
            <p>
              Right now I work remotely with a US team at Star Computer Labs. Agenticly, an AI crypto research
              assistant, has 26K installs across web, Android and iOS. I took over full ownership of Kitty Nip,
              which now reports 100% crash-free on Crashlytics. I also own releases for AI Maker Pro, a Flutter
              app with 100K+ downloads.
            </p>
            <p>
              On the side I run Jafrix Systems, a small software studio. Its longest engagement is BugMapper, a
              greenhouse pest-monitoring platform used in Kayseri, Türkiye: recording a trap went from 5 to 10
              minutes on paper to about 10 seconds.
            </p>
            <p>
              Before that I was Tech Lead at StackUp Solutions for four years, leading teams of up to nine across
              client products in healthcare, workplace and payments.
            </p>
          </div>

          <aside className="h-fit space-y-8 text-[15px] md:sticky md:top-24">
            <div>
              <h2 className="eyebrow">Education</h2>
              <p className="mt-3 text-foreground">B.Sc. Computer Science, 2016 – 2020</p>
              <p className="text-muted">COMSATS University Islamabad, Lahore campus</p>
            </div>

            <div>
              <h2 className="eyebrow">Available for</h2>
              <div className="mt-3 space-y-1.5 text-muted">
                <p>Senior React Native, mobile and full-stack roles ($50K–$120K)</p>
                <p>Remote, or relocating</p>
                <p>Freelance projects</p>
              </div>
            </div>

            <div>
              <h2 className="eyebrow">Resume</h2>
              <a href="/resume" className="mt-2 inline-block py-1 link-underline text-foreground">
                View printable resume
              </a>
            </div>

            <div>
              <h2 className="eyebrow">Languages</h2>
              <p className="mt-3 text-muted">English (C1 to C2), Urdu (native)</p>
            </div>
          </aside>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-24 px-6 pb-24">
        <section aria-label="By the numbers">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-10 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className={`hd text-foreground ${stat.value.length > 6 ? "text-2xl sm:text-3xl" : "text-4xl"}`}>{stat.value}</dt>
                <dd className="mt-2 text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </section>
        <ExperienceTimeline />
      </div>
    </>
  );
}
