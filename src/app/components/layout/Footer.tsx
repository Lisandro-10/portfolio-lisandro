"use client";

import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-dark-lighter py-6 sm:py-8 text-center border-t border-dark-lighter">
      <p className="text-xs sm:text-sm text-gray-400">{t("rights")}</p>
    </footer>
  );
};