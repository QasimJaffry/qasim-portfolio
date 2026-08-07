import Hero from "@/components/Hero";
import AvailabilityStrip from "@/components/AvailabilityStrip";
import FeaturedProjects from "@/components/FeaturedProjects";
import HireScopes from "@/components/HireScopes";
import Testimonials from "@/components/Testimonials";
import ProcessSection from "@/components/ProcessSection";
import SkillsGrid from "@/components/SkillsGrid";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AvailabilityStrip />
      <FeaturedProjects />
      <HireScopes />
      <ProcessSection />
      <Testimonials />
      <SkillsGrid />
      <FaqSection limit={3} />
      <ContactSection />
    </>
  );
}
