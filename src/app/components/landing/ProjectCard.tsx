import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl: string;
}

export default function ProjectCard({
  title,
  description,
  image,
  tags,
  liveUrl,
  githubUrl,
}: ProjectCardProps) {
  const t = useTranslations("Projects");

  return (
    <div className="project-card group">
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-dark-lighter">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-300 mb-4">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="tech-badge">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink size={16} />
              <span>{t("viewProject")}</span>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Github size={16} />
              <span>{t("demo")}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}