"use client";

import { useState } from "react";
import { FiMail, FiMapPin, FiGithub, FiUser, FiAtSign, FiBriefcase, FiMessageSquare, FiArrowRight } from "react-icons/fi";
import { FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations("Contact");
  const tServices = useTranslations("Services");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          name: (form.elements.namedItem("name") as HTMLInputElement).value,
          email: (form.elements.namedItem("email") as HTMLInputElement).value,
          subject: `Consulta desde el portfolio`,
          message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        form.reset();
      } else {
        setError(t("form.error"));
      }
    } catch {
      setError(t("form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="section-container">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary dark:text-white mb-2">
            {t("title")}
          </h2>
          <p className="text-sm sm:text-base text-text-secondary dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Connect Card */}
          <div className="card p-6">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-text-tertiary mb-5">
              {t("quickConnect")}
            </h3>

            {/* Quick links */}
            <div className="flex justify-center gap-6 mb-6">
              <a href="mailto:lisandroandia14@gmail.com" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FiMail size={20} className="text-primary" />
                </div>
                <span className="text-xs text-text-tertiary">{t("email")}</span>
              </a>
              <a href="https://wa.me/5492612657201" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <FaWhatsapp size={20} className="text-green-500" />
                </div>
                <span className="text-xs text-text-tertiary">{t("whatsapp")}</span>
              </a>
              <a href="https://www.linkedin.com/in/lisandro-andia-3b46aa23a" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <FaLinkedinIn size={20} className="text-blue-600" />
                </div>
                <span className="text-xs text-text-tertiary">{t("linkedin")}</span>
              </a>
            </div>

            {/* Info */}
            <div className="border-t border-border-light dark:border-dark-lighter pt-5 space-y-3">
              <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-gray-400">
                <FiMapPin size={16} className="text-text-tertiary flex-shrink-0" />
                <span>{t("location")}</span>
              </div>
              <a href="https://github.com/lisandro-10" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-text-secondary dark:text-gray-400 hover:text-primary transition-colors">
                <FiGithub size={16} className="text-text-tertiary flex-shrink-0" />
                <span>github.com/lisandro-10</span>
              </a>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="card p-6">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-text-tertiary mb-5">
              {t("form.title")}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm mb-1.5 text-text-secondary dark:text-gray-300">
                  {t("form.name")}
                </label>
                <div className="relative">
                  <FiUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="text" id="name" name="name" required
                    placeholder={t("form.namePlaceholder")}
                    className="w-full pl-10 pr-4 py-3 bg-surface-secondary dark:bg-dark border border-border-light dark:border-dark-lighter rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm mb-1.5 text-text-secondary dark:text-gray-300">
                  {t("form.email")}
                </label>
                <div className="relative">
                  <FiAtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="email" id="email" name="email" required
                    placeholder={t("form.emailPlaceholder")}
                    className="w-full pl-10 pr-4 py-3 bg-surface-secondary dark:bg-dark border border-border-light dark:border-dark-lighter rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm mb-1.5 text-text-secondary dark:text-gray-300">
                  {t("form.service")}
                </label>
                <div className="relative">
                  <FiBriefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <select
                    id="service" name="service"
                    className="w-full pl-10 pr-4 py-3 bg-surface-secondary dark:bg-dark border border-border-light dark:border-dark-lighter rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm appearance-none transition-all"
                  >
                    <option value="">{t("form.selectService")}</option>
                    <option value="landing">{tServices("plans.landing.title")}</option>
                    <option value="professional">{tServices("plans.professional.title")}</option>
                    <option value="ecommerce">{tServices("plans.ecommerce.title")}</option>
                    <option value="custom">{tServices("plans.customSolution.title")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm mb-1.5 text-text-secondary dark:text-gray-300">
                  {t("form.message")}
                </label>
                <textarea
                  id="message" name="message" rows={4} required
                  placeholder={t("form.messagePlaceholder")}
                  className="w-full px-4 py-3 bg-surface-secondary dark:bg-dark border border-border-light dark:border-dark-lighter rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm resize-none transition-all"
                />
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}
              {isSuccess && <p className="text-green-500 text-xs">{t("form.success")}</p>}

              <button
                type="submit" disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? t("form.sending") : t("form.submit")}</span>
                {!isSubmitting && <FiArrowRight size={16} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}