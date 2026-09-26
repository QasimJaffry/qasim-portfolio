import Sidebar from "@/components/Sidebar";
import { TabBar } from "@/components/SectionNav";
import Hero from "@/components/Hero";
import ProofTicker from "@/components/ProofTicker";
import FeaturedProjects from "@/components/FeaturedProjects";
import WhatITakeOn from "@/components/WhatITakeOn";
import Testimonials from "@/components/Testimonials";
import SkillsGrid from "@/components/SkillsGrid";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";

/** Faint line-number gutter, purely decorative. */
const gutter = Array.from({ length: 420 }, (_, i) => i + 1).join("\n");

export default function Home() {
  return (
    <div data-shell className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
      <Sidebar />

      <div className="relative min-w-0 border-border lg:border-l">
        <TabBar />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 top-[45px] hidden w-12 select-none overflow-hidden border-r border-border/60 lg:block"
        >
          <pre className="pr-3 pt-14 text-right font-mono text-[11px] leading-6 text-muted/35">
            {gutter}
          </pre>
        </div>

        <div className="lg:pl-12">
          <Hero />
          <ProofTicker />
          <FeaturedProjects />
          <WhatITakeOn />
          <Testimonials />
          <SkillsGrid />
          <FaqSection limit={3} />
          <ContactSection />
        </div>
      </div>
    </div>
  );
}
