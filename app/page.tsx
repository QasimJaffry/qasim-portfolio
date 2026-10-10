import FeaturedProjects from "@/components/FeaturedProjects";
import WhatITakeOn from "@/components/WhatITakeOn";
import SkillsGrid from "@/components/SkillsGrid";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import MobileCta from "@/components/MobileCta";

export default function Home() {
  return (
    <>
      <FeaturedProjects />
      <WhatITakeOn />
      <SkillsGrid />
      <Testimonials />
      <FaqSection limit={3} />
      <ContactSection />
      <MobileCta />
    </>
  );
}
