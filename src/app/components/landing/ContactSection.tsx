"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Github, Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;

    const serviceValue = (
      form.elements.namedItem("service") as HTMLSelectElement
    ).value;
    const serviceLabels: Record<string, string> = {
      landing: t("Services.plans.landing.title"),
      professional: t("Services.plans.professional.title"),
      ecommerce: t("Services.plans.ecommerce.title"),
      customSolution: t("Services.plans.customSolution.title"),
    };

    const subject = serviceValue
      ? `Consulta: ${serviceLabels[serviceValue]}`
      : "Consulta desde el portfolio";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: (form.elements.namedItem("name") as HTMLInputElement).value,
          email: (form.elements.namedItem("email") as HTMLInputElement).value,
          subject: subject,
          message: (form.elements.namedItem("message") as HTMLTextAreaElement)
            .value,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        form.reset();
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="section-container bg-dark-lighter/50 mb-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
          {t("Contact.title")}
        </h2>
        <p className="text-sm sm:text-base text-gray-300 text-center mb-8 sm:mb-12">
          {t("Contact.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-dark-lighter p-4 sm:p-6 md:p-8 rounded-lg border border-dark-lighter">
            <h3 className="text-xl sm:text-2xl font-bold mb-6">
              {t("Contact.info")}
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <a
                href="mailto:lisandroandia14@gmail.com"
                className="flex items-center gap-3 text-sm sm:text-base text-gray-300 hover:text-primary transition-colors"
              >
                <Mail size={20} className="flex-shrink-0" />
                <span>lisandroandia14@gmail.com</span>
              </a>
              <a
                href="tel:+542645021485"
                className="flex items-center gap-3 text-sm sm:text-base text-gray-300 hover:text-primary transition-colors"
              >
                <Phone size={20} className="flex-shrink-0" />
                <span>+54 264 502 1485</span>
              </a>
              <div className="flex items-center gap-3 text-sm sm:text-base text-gray-300">
                <MapPin size={20} className="flex-shrink-0" />
                <span>{t("Contact.location")}</span>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
              <a
                href="https://github.com/lisandro-10"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 bg-dark hover:bg-primary transition-colors rounded-full"
                aria-label="GitHub"
              >
                <Github size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/lisandro-andia-3b46aa23a"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 bg-dark hover:bg-primary transition-colors rounded-full"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>

          <div className="bg-dark-lighter p-4 sm:p-6 md:p-8 rounded-lg border border-dark-lighter">
            <h3 className="text-xl sm:text-2xl font-bold mb-6">
              {t("Contact.form.title")}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm sm:text-base mb-2"
                >
                  {t("Contact.form.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t("Contact.form.namePlaceholder")}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-darker border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base mb-2"
                >
                  {t("Contact.form.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t("Contact.form.emailPlaceholder")}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-darker border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="service"
                  className="block text-sm sm:text-base mb-2"
                >
                  {t("Contact.form.service")}
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-darker border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-sm sm:text-base"
                >
                  <option value="">
                    {t("Contact.form.selectService")}
                  </option>
                  <option value="landing">
                    {t("Services.plans.landing.title")}
                  </option>
                  <option value="professional">
                    {t("Services.plans.professional.title")}
                  </option>
                  <option value="ecommerce">
                    {t("Services.plans.ecommerce.title")}
                  </option>
                  <option value="customSolution">
                    {t("Services.plans.customSolution.title")}
                  </option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm sm:text-base mb-2"
                >
                  {t("Contact.form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder={t("Contact.form.messagePlaceholder")}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-darker border border-gray-700 rounded-lg focus:border-primary focus:outline-none resize-none text-sm sm:text-base"
                ></textarea>
              </div>
              {error && (
                <p className="text-red-500 text-xs sm:text-sm">{error}</p>
              )}
              {isSuccess && (
                <p className="text-green-500 text-xs sm:text-sm">
                  {t("Contact.form.success")}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting
                  ? t("Contact.form.sending")
                  : t("Contact.form.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
