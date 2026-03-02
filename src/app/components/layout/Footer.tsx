"use client";

import { FiGithub, FiLinkedin, FiMail, FiMapPin } from "react-icons/fi";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("Footer");
  const tContact = useTranslations("Contact");

  return (
    <footer className="border-t border-border dark:border-dark-lighter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Left - Brand */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-text-primary dark:text-white">Lisandro Andia</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-text-tertiary">
              <FiMapPin size={14} />
              <span>{tContact("location")}</span>
            </div>
          </div>

          {/* Center - Social links */}
          <div className="flex items-center gap-3">
            <a
              href="mailto:lisandroandia14@gmail.com"
              className="p-2.5 bg-surface-tertiary dark:bg-dark-lighter text-text-tertiary hover:text-primary hover:bg-primary/10 transition-all rounded-full"
              aria-label="Email"
            >
              <FiMail size={18} />
            </a>
            <a
              href="https://github.com/lisandro-10"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-surface-tertiary dark:bg-dark-lighter text-text-tertiary hover:text-primary hover:bg-primary/10 transition-all rounded-full"
              aria-label="GitHub"
            >
              <FiGithub size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/lisandro-andia-3b46aa23a"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-surface-tertiary dark:bg-dark-lighter text-text-tertiary hover:text-primary hover:bg-primary/10 transition-all rounded-full"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={18} />
            </a>
          </div>

          {/* Right - Copyright */}
          <p className="text-xs text-text-tertiary text-center sm:text-right">
            {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};