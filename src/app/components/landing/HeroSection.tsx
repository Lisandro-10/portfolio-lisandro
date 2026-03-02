"use client";

import Image from "next/image";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center section-container">
      <div className="w-full flex flex-col items-center text-center">
        {/* Profile Photo */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-primary/20 blur-[40px] rounded-full" />
          <div className="relative w-64 h-64 rounded-full border-4 border-white shadow-xl overflow-hidden">
            <Image
              src="/profile-about.jpg"
              alt="Lisandro Andia"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary dark:text-white mb-2">
          {t("name")}
        </h1>
        <h2 className="text-lg sm:text-xl text-primary font-medium mb-4 max-w-md">
          {t("role")}
        </h2>
        <p className="text-sm sm:text-base text-text-secondary dark:text-gray-400 max-w-md mb-6 leading-relaxed">
          {t("description")}
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-4 mb-8">
          <a href="mailto:lisandroandia14@gmail.com" className="text-text-tertiary hover:text-primary transition-colors">
            <FiMail size={20} />
          </a>
          <a href="https://github.com/lisandro-10" target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-primary transition-colors">
            <FiGithub size={20} />
          </a>
          <a href="https://www.linkedin.com/in/lisandro-andia-3b46aa23a" target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-primary transition-colors">
            <FiLinkedin size={20} />
          </a>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a href="/#servicios" className="btn-primary text-center">
            {t("viewServices")}
          </a>
          <a href="/#contacto" className="btn-secondary text-center">
            {t("contactMe")}
          </a>
        </div>
      </div>
    </section>
  );
}