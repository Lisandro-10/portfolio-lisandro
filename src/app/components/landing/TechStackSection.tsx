"use client";

import { useTranslations } from "next-intl";
import { FiCode } from "react-icons/fi";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiPostgresql, SiOpenjdk, SiSpringboot, SiMysql
} from "react-icons/si";
import { techStack } from "@/data/techStack";
import { BiLogoAws } from "react-icons/bi";

const iconMap: Record<string, React.ElementType> = {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiPostgresql, SiOpenjdk, SiSpringboot, SiMysql, BiLogoAws
};

export default function TechStackSection() {
  const t = useTranslations("TechStack");

  return (
    <section className="section-container">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-6">
          <FiCode className="text-text-tertiary" size={20} />
          <h2 className="text-xl font-bold text-text-primary dark:text-white">
            {t("title")}
          </h2>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
            {techStack.map((tech) => {
              const IconComponent = iconMap[tech.icon];
              return (
                <div key={tech.key} className="flex flex-col items-center gap-2 min-w-[72px]">
                  <div className="w-14 h-14 bg-white dark:bg-dark-lighter border border-border-light dark:border-dark-lighter rounded-2xl shadow-sm flex items-center justify-center">
                    {IconComponent && <IconComponent size={28} style={{ color: tech.color }} />}
                  </div>
                  <span className="text-xs font-medium text-text-tertiary">
                    {t(`items.${tech.key}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}