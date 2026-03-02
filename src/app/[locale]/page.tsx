import HeroSection from "../components/landing/HeroSection";
import TechStackSection from "../components/landing/TechStackSection";
import ProjectsSection from "../components/landing/ProjectsSection";
import AboutSection from "../components/landing/AboutSection";
import ServicesSection from "../components/landing/ServicesSection";
import ContactSection from "../components/landing/ContactSection";

export default function Home() {
  return (
    <main className="pt-16">
      <HeroSection />
      <TechStackSection />
      <ProjectsSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
    </main>
  );
}