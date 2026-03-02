"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiX, FiMoon, FiSun, FiGlobe } from "react-icons/fi";
import { useTheme } from "@/app/hooks/useTheme";
import { useHydration } from "@/app/hooks/useHydration";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const hydrated = useHydration();
  const t = useTranslations("Navbar");
  const tLang = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setLangMenuOpen(false);
  };

  const navItems = [
    { name: t("projects"), href: "/#proyectos" },
    { name: t("services"), href: "/#servicios" },
    { name: t("about"), href: "/#experiencia" },
    { name: t("contact"), href: "/#contacto" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md bg-white/80 dark:bg-dark/90 border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-text-primary dark:text-white">
                Lisandro Andia
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-text-secondary dark:text-gray-300 hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2 text-text-tertiary hover:text-primary transition-colors rounded-lg hover:bg-surface-tertiary dark:hover:bg-dark-lighter flex items-center gap-1"
                >
                  <FiGlobe size={18} />
                  <span className="text-xs uppercase">{locale}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-dark-lighter border border-border dark:border-dark-lighter rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => handleLanguageChange("es")}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-tertiary dark:hover:bg-dark ${
                        locale === "es" ? "text-primary font-medium" : "text-text-secondary dark:text-gray-300"
                      }`}
                    >
                      {tLang("es")}
                    </button>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-tertiary dark:hover:bg-dark ${
                        locale === "en" ? "text-primary font-medium" : "text-text-secondary dark:text-gray-300"
                      }`}
                    >
                      {tLang("en")}
                    </button>
                  </div>
                )}
              </div>

              {hydrated && (
                <button
                  onClick={toggleTheme}
                  className="p-2 text-text-tertiary hover:text-primary transition-colors rounded-lg hover:bg-surface-tertiary dark:hover:bg-dark-lighter"
                >
                  {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
                </button>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2 text-text-tertiary hover:text-primary transition-colors"
                >
                  <FiGlobe size={18} />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-dark-lighter border border-border rounded-xl shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => handleLanguageChange("es")}
                      className={`w-full px-4 py-2.5 text-left text-sm ${locale === "es" ? "text-primary" : "text-text-secondary"}`}
                    >
                      {tLang("es")}
                    </button>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full px-4 py-2.5 text-left text-sm ${locale === "en" ? "text-primary" : "text-text-secondary"}`}
                    >
                      {tLang("en")}
                    </button>
                  </div>
                )}
              </div>

              {hydrated && (
                <button onClick={toggleTheme} className="p-2 text-text-tertiary hover:text-primary transition-colors">
                  {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
                </button>
              )}

              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-text-primary dark:text-white hover:text-primary transition-colors">
                {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white/95 dark:bg-dark/95 backdrop-blur-xl">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-base text-text-secondary dark:text-gray-300 hover:text-primary rounded-lg px-3 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}