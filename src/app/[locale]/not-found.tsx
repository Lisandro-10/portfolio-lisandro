"use client";

import { Home, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-primary/20 mb-4 sm:mb-6">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          {t("title")}
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 sm:mb-10 max-w-md mx-auto">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            href="/"
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Home size={18} />
            <span>{t("backHome")}</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>{t("previousPage")}</span>
          </button>
        </div>

        <div className="mt-12 sm:mt-16 pt-8 border-t border-dark-lighter">
          <p className="text-xs sm:text-sm text-gray-400 mb-4">
            {t("explore")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/#proyectos"
              className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {t("myProjects")}
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/#sobre-mi"
              className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {t("aboutMe")}
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/#contacto"
              className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}