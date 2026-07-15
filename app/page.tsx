import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import SkillsGrid from "@/components/SkillsGrid";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <SkillsGrid />
      <ContactSection />
    </>
  );
}
