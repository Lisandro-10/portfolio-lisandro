"use client";

import PricingCard from "../../components/landing/PricingCard";
import { Mail, Phone, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Servicios() {
  const t = useTranslations("Services");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    { key: "landing" },
    { key: "professional" },
    { key: "ecommerce" },
  ];

  const faqKeys = ["revision", "maintenance", "additional"];

  return (
    <>
      <main className="pt-14 sm:pt-16">
        {/* Hero Section */}
        <section className="section-container text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t("heroTitle")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
        </section>

        {/* Pricing Cards Section */}
        <section className="section-container bg-dark-lighter/50">
          <div className="flex flex-col items-center max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.key}
                  title={t(`plans.${plan.key}.title`)}
                  description={t(`plans.${plan.key}.description`)}
                  features={t.raw(`plans.${plan.key}.features`) as string[]}
                />
              ))}
            </div>
            <div className="mt-6 lg:w-1/2 ">
              <PricingCard
                title={t("plans.customSolution.title")}
                description={t("plans.customSolution.description")}
                features={t.raw("plans.customSolution.features") as string[]}
              />
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
              {t("faqTitle")}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {faqKeys.map((faqKey, index) => (
                <div
                  key={faqKey}
                  className="bg-dark-lighter rounded-lg border border-dark-lighter overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center gap-4"
                  >
                    <span className="text-sm sm:text-base font-medium text-white">
                      {t(`faq.${faqKey}.question`)}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-primary flex-shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <p className="px-4 sm:px-6 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-400">
                      {t(`faq.${faqKey}.answer`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section id="contacto-servicios" className="section-container bg-dark-lighter/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
              {t("ctaSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 sm:mb-8">
              <a
                href="/#contacto"
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                <span>{t("sendEmail")}</span>
              </a>
              <a
                href="tel:+542612657201"
                className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                <span>+54 261 2657201</span>
              </a>
            </div>

            <a
              href="/#contacto"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {t("useContactForm")}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}