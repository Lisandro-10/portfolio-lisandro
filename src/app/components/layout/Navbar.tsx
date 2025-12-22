"use client";

import { useState, useEffect } from "react";
import { Menu, Moon, Sun, X, Globe } from "lucide-react";
import { useTheme } from "@/src/app/hooks/useTheme";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("Navbar");
  const tLang = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setLangMenuOpen(false);
  };

  const navItems = [
    { name: t("projects"), href: "/#proyectos" },
    { name: t("services"), href: "/servicios" },
    { name: t("about"), href: "/#sobre-mi" },
    { name: t("contact"), href: "/#contacto" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled && !isOpen
            ? "bg-dark/95 backdrop-blur-md border-b border-dark-lighter shadow-lg"
            : isOpen
            ? "bg-dark-darker"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link
              href="/"
              className="text-base sm:text-lg md:text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Lisandro Andia
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm lg:text-base text-gray-300 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                >
                  {item.name}
                </Link>
              ))}

              {/* Language Switcher - Desktop */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2 text-white hover:text-primary transition-colors rounded-lg hover:bg-dark-lighter flex items-center gap-1"
                  aria-label="Change language"
                >
                  <Globe size={20} />
                  <span className="text-xs uppercase">{locale}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-dark-lighter border border-dark rounded-lg shadow-lg overflow-hidden">
                    <button
                      onClick={() => handleLanguageChange("es")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-dark transition-colors ${
                        locale === "es" ? "text-primary" : "text-gray-300"
                      }`}
                    >
                      {tLang("es")}
                    </button>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-dark transition-colors ${
                        locale === "en" ? "text-primary" : "text-gray-300"
                      }`}
                    >
                      {tLang("en")}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 text-white hover:text-primary transition-colors rounded-lg hover:bg-dark-lighter"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-2">
              {/* Language Switcher - Mobile */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2 text-white hover:text-primary transition-colors rounded-lg hover:bg-dark-lighter"
                  aria-label="Change language"
                >
                  <Globe size={20} />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-dark-lighter border border-dark rounded-lg shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => handleLanguageChange("es")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-dark transition-colors ${
                        locale === "es" ? "text-primary" : "text-gray-300"
                      }`}
                    >
                      {tLang("es")}
                    </button>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-dark transition-colors ${
                        locale === "en" ? "text-primary" : "text-gray-300"
                      }`}
                    >
                      {tLang("en")}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 text-white hover:text-primary transition-colors rounded-lg hover:bg-dark-lighter"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-1 hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-14 sm:top-16 z-40 bg-dark-darker/75 backdrop-blur-xl">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-base text-gray-300 hover:text-white hover:bg-dark-lighter/50 rounded-lg px-3 transition-all"
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