"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "@/app/hooks/useTheme";
import { useHydration } from "@/app/hooks/useHydration";

export default function HeroSection() {
  const t = useTranslations("Hero");
  const { theme } = useTheme();
  const hydrated = useHydration();

  return (
    <section className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex items-center section-container">
      <div className="w-full">
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-8 md:gap-12">
          <div className="flex-1 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4">
              {t("name")}
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-primary mb-4 sm:mb-6">
              {t("role")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mb-6 sm:mb-8 mx-auto">
              {t("description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="/servicios"
                className="btn-primary w-full sm:w-auto text-center"
              >
                {t("viewServices")}
              </a>
              <a
                href="#contacto"
                className="btn-secondary w-full sm:w-auto text-center"
              >
                {t("contactMe")}
              </a>
            </div>
          </div>

          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[450px] xl:h-[450px] 2xl:w-[500px] 2xl:h-[500px]">
              <Image
                src={
                  hydrated
                    ? theme === "light"
                      ? "/logo-la-black.png"
                      : "/logo-la-white.png"
                    : "/logo-la-white.png"
                }
                alt="Lisandro Andia"
                fill
                className="object-cover rounded-3xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
