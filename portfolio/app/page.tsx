import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import WorkSection from "@/components/sections/WorkSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

