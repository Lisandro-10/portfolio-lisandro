"use client";

import { useTranslations } from "next-intl";
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  const t = useTranslations("Projects");

  return (
    <section id="proyectos" className="section-container">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary dark:text-white">
              {t("title")}
            </h2>
            <p className="text-sm text-text-tertiary mt-1">{t("subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.key}
              title={t(`items.${project.key}.title`)}
              description={t(`items.${project.key}.description`)}
              image={project.image}
              tags={project.tags}
              liveUrl={project.liveUrl}
              githubUrl={project.githubUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}