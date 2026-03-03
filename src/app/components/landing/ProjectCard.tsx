import Image from "next/image";
import { FiExternalLink, FiGithub, FiLock } from "react-icons/fi";
import { useTranslations } from "next-intl";

const tagColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-tag-blue-bg", text: "text-tag-blue-text" },
  purple: { bg: "bg-tag-purple-bg", text: "text-tag-purple-text" },
  teal: { bg: "bg-tag-teal-bg", text: "text-tag-teal-text" },
  orange: { bg: "bg-tag-orange-bg", text: "text-tag-orange-text" },
  green: { bg: "bg-tag-green-bg", text: "text-tag-green-text" },
  rose: { bg: "bg-tag-rose-bg", text: "text-tag-rose-text" },
};

interface ProjectTag {
  label: string;
  color: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: ProjectTag[];
  liveUrl?: string | null;
  githubUrl?: string | null;
}

export default function ProjectCard({
  title, description, image, tags, liveUrl, githubUrl
}: ProjectCardProps) {
  const t = useTranslations("Projects");

  return (
    <div className="card overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-text-secondary dark:text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => {
            const colors = tagColors[tag.color] || tagColors.blue;
            return (
              <span
                key={tag.label}
                className={`tech-badge ${colors.bg} ${colors.text} dark:bg-opacity-20`}
              >
                {tag.label}
              </span>
            );
          })}
        </div>

        {/* Links */}
        <div className="flex gap-4 pt-4 border-t border-border-light dark:border-dark-lighter">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <FiExternalLink size={14} />
              <span>{t("liveDemo")}</span>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-text-tertiary hover:text-text-primary dark:hover:text-white transition-colors"
            >
              <FiGithub size={14} />
              <span>{t("sourceCode")}</span>
            </a>
          )}
          {!githubUrl && !liveUrl && (
            <span className="flex items-center gap-1.5 text-sm text-text-tertiary">
              <FiLock size={14} />
              <span>{t("privateRepo")}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}