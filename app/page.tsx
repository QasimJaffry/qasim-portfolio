import Hero from "@/components/Hero";
import ProofTicker from "@/components/ProofTicker";
import FeaturedProjects from "@/components/FeaturedProjects";
import WhatITakeOn from "@/components/WhatITakeOn";
import Testimonials from "@/components/Testimonials";
import SkillsGrid from "@/components/SkillsGrid";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProofTicker />
      <FeaturedProjects />
      <WhatITakeOn />
      <Testimonials />
      <SkillsGrid />
      <FaqSection limit={3} />
      <ContactSection />
    </>
  );
}
