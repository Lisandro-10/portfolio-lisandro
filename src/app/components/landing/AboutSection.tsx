"use client";

import { useTranslations } from "next-intl";
import { experiences } from "@/data/experiences";

export default function AboutSection() {
  const t = useTranslations("About");

  return (
    <section id="experiencia" className="section-container">
      <div className="max-w-3xl mx-auto">
        <div className="card p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />

          <h2 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white mb-8 relative">
            {t("title")}
          </h2>

          {/* Timeline */}
          <div className="border-l-2 border-border dark:border-gray-600 pl-6 sm:pl-8 space-y-8 relative">
            {experiences.map((exp, index) => (
              <div key={exp.key} className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[33px] sm:-left-[41px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-dark-card ${
                    index === 0 ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />

                <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white">
                  {t(`experiences.${exp.key}.role`)}
                </h3>
                <p className="text-sm text-primary font-medium">
                  {t(`experiences.${exp.key}.company`)}
                </p>
                <p className="text-xs text-text-tertiary mt-1 mb-3">
                  {t(`experiences.${exp.key}.period`)}
                </p>
                <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
                  {t(`experiences.${exp.key}.description`)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="tech-badge bg-tag-blue-bg text-tag-blue-text dark:bg-opacity-20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}