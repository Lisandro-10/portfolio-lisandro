"use client";

import { useTranslations } from "next-intl";
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  const t = useTranslations("Projects");

  return (
    <section id="proyectos" className="section-container bg-dark-lighter/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
          {t("title")}
        </h2>
        <p className="text-sm sm:text-base text-gray-300 text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
          {t("subtitle")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.key}
              title={t(`items.${project.key}.title`)}
              description={t(`items.${project.key}.description`)}
              image={project.image}
              tags={project.tags}
              liveUrl={project.liveUrl || ""}
              githubUrl={project.githubUrl || ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
