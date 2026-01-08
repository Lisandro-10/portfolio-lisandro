"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { experiences } from "@/data/experiences";

export default function AboutSection() {
  const t = useTranslations("About");

  return (
    <section id="sobre-mi" className="section-container">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center">
          {t("title")}
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
              {t("trajectory")}
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
                      {t(`experiences.${exp.key}.role`)}
                    </h4>
                    <p className="text-sm sm:text-base text-primary mb-2">
                      {t(`experiences.${exp.key}.company`)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-3">
                      {t(`experiences.${exp.key}.period`)}
                    </p>
                    <p className="text-sm sm:text-base text-gray-300 mb-3">
                      {t(`experiences.${exp.key}.description`)}
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
  );
}
