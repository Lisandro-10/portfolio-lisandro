"use client";

import ProjectCard from "../components/landing/ProjectCard";
import Image from "next/image";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/app/hooks/useTheme";
import { useHydration } from "@/app/hooks/useHydration";
import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";

export default function Home() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const hydrated = useHydration();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;

    const serviceValue = (form.elements.namedItem("service") as HTMLSelectElement).value;
    const serviceLabels: Record<string, string> = {
      landing: t("Services.plans.landing.title"),
      professional: t("Services.plans.professional.title"),
      ecommerce: t("Services.plans.ecommerce.title"),
      customSolution: t("Services.plans.customSolution.title"),
    };

    const subject = serviceValue 
      ? `Consulta: ${serviceLabels[serviceValue]}` 
      : "Consulta desde el portfolio";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "75c18e52-bb2d-4a95-a933-f6f395a57ebb",
          name: (form.elements.namedItem("name") as HTMLInputElement).value,
          subject: subject,
          email: (form.elements.namedItem("email") as HTMLInputElement).value,
          message: (form.elements.namedItem("message") as HTMLTextAreaElement)
            .value,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        form.reset();
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="pt-14 sm:pt-16">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex items-center section-container">
          <div className="w-full">
            <div className="flex flex-col-reverse md:flex-row md:items-center  gap-8 md:gap-12">
              <div className="flex-1 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4">
                  {t("Hero.name")}
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl text-primary mb-4 sm:mb-6">
                  {t("Hero.role")}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mb-6 sm:mb-8 mx-auto">
                  {t("Hero.description")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a href="#proyectos" className="btn-primary w-full sm:w-auto text-center">
                    {t("Hero.viewProjects")}
                  </a>
                  <a href="#contacto" className="btn-secondary w-full sm:w-auto text-center">
                    {t("Hero.contactMe")}
                  </a>
                </div>
              </div>

              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[450px] xl:h-[450px] 2xl:w-[500px] 2xl:h-[500px]">
                  <Image
                    src={
                      hydrated
                        ? theme === "light"
                          ? "/logo-la-black.png"
                          : "/logo-la-white.png"
                        : "/logo-la-white.png"
                    }
                    alt="Lisandro Andia"
                    fill
                    className="object-cover rounded-3xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="proyectos" className="section-container bg-dark-lighter/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
              {t("Projects.title")}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              {t("Projects.subtitle")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project.key}
                  title={t(`Projects.items.${project.key}.title`)}
                  description={t(`Projects.items.${project.key}.description`)}
                  image={project.image}
                  tags={project.tags}
                  liveUrl={project.liveUrl || ""}
                  githubUrl={project.githubUrl || ""}
                />
              ))}
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section id="sobre-mi" className="section-container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center">
              {t("About.title")}
            </h2>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary/20">
                  <Image
                    src="/profile-about.jpg"
                    alt="Lisandro Andia"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 w-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center md:text-left">
                  {t("About.trajectory")}
                </h3>

                <div className="space-y-6 sm:space-y-8">
                  {experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="relative pl-6 sm:pl-8 border-l-2 border-primary/30"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary"></div>

                      <div className="pb-2">
                        <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                          {t(`About.experiences.${exp.key}.role`)}
                        </h4>
                        <p className="text-sm sm:text-base text-primary mb-2">
                          {t(`About.experiences.${exp.key}.company`)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 mb-3">
                          {t(`About.experiences.${exp.key}.period`)}
                        </p>
                        <p className="text-sm sm:text-base text-gray-300 mb-3">
                          {t(`About.experiences.${exp.key}.description`)}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {exp.tags.map((tag) => (
                            <span key={tag} className="tech-badge">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" className="section-container bg-dark-lighter/50 mb-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
              {t("Contact.title")}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 text-center mb-8 sm:mb-12">
              {t("Contact.subtitle")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-dark-lighter p-4 sm:p-6 md:p-8 rounded-lg border border-dark-lighter">
                <form className="space-y-4 sm:space-y-5" onSubmit={onSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t("Contact.form.name")}{t("Contact.form.required")}
                    </label>
                    <input
                      name="name"
                      type="text"
                      id="name"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-darker border border-dark-lighter rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base transition-colors"
                      placeholder={t("Contact.form.namePlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t("Contact.form.email")}{t("Contact.form.required")}
                    </label>
                    <input
                      name="email"
                      type="email"
                      id="email"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-darker border border-dark-lighter rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base transition-colors"
                      placeholder={t("Contact.form.emailPlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium mb-2">
                      {t("Contact.form.service")}
                    </label>
                    <select 
                      name="service" 
                      id="service" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-darker border border-dark-lighter rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">{t("Contact.form.servicePlaceholder")}</option>
                      <option value="landing">{t("Contact.form.serviceLanding")}</option>
                      <option value="professional">{t("Contact.form.serviceProfessional")}</option>
                      <option value="ecommerce">{t("Contact.form.serviceEcommerce")}</option>
                      <option value="customSolution">{t("Contact.form.serviceCustom")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      {t("Contact.form.message")}{t("Contact.form.required")}
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-darker border border-dark-lighter rounded-lg focus:outline-none focus:border-primary resize-none text-sm sm:text-base transition-colors"
                      placeholder={t("Contact.form.messagePlaceholder")}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                    {isSubmitting ? t("Contact.form.sending") : t("Contact.form.submit")}
                  </button>
                  <p className="text-sm text-gray-300 mt-2">
                    {isSuccess ? t("Contact.form.success") : error}
                  </p>
                </form>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    {t("Contact.findMe")}
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <a
                      href="mailto:lisandroandia14@gmail.com"
                      className="flex items-center gap-3 text-sm sm:text-base text-gray-300 hover:text-primary transition-colors"
                    >
                      <Mail size={20} className="flex-shrink-0" />
                      <span>lisandroandia14@gmail.com</span>
                    </a>
                    <a
                      href="tel:+542612657201"
                      className="flex items-center gap-3 text-sm sm:text-base text-gray-300 hover:text-primary transition-colors"
                    >
                      <Phone size={20} className="flex-shrink-0" />
                      <span>+54 261 2657201</span>
                    </a>
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-300">
                      <MapPin size={20} className="flex-shrink-0" />
                      <span>{t("Contact.location")}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/lisandro-10"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-dark-lighter hover:bg-primary rounded-lg transition-all hover:scale-110"
                      aria-label="GitHub"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/lisandro-andia-3b46aa23a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-dark-lighter hover:bg-primary rounded-lg transition-all hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}