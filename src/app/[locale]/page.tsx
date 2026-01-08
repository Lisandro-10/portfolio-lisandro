import HeroSection from "../components/landing/HeroSection";
import ProjectsSection from "../components/landing/ProjectsSection";
import AboutSection from "../components/landing/AboutSection";
import ContactSection from "../components/landing/ContactSection";

export default function Home() {
  return (
    <main className="pt-14 sm:pt-16">
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
