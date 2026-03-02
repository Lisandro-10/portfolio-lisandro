"use client";

import { useTranslations } from "next-intl";
import { FiCode, FiShoppingBag, FiLayout, FiArrowRight } from "react-icons/fi";

const planIcons: Record<string, React.ElementType> = {
  landing: FiLayout,
  professional: FiCode,
  ecommerce: FiShoppingBag,
};

export default function ServicesSection() {
  const t = useTranslations("Services");

  const plans = ["landing", "professional", "ecommerce"];

  return (
    <section id="servicios" className="section-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary dark:text-white mb-3">
            {t("title")}
          </h2>
          <p className="text-sm sm:text-base text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {plans.map((planKey) => {
            const Icon = planIcons[planKey];
            const isPopular = planKey === "professional";
            const features = t.raw(`plans.${planKey}.features`) as string[];

            return (
              <div
                key={planKey}
                className={`card relative flex flex-col p-6 sm:p-7 ${
                  isPopular ? "ring-2 ring-accent shadow-lg shadow-accent/10" : ""
                }`}
              >
                {/* Label badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                      {t(`plans.${planKey}.label`)}
                    </span>
                  </div>
                )}
                {!isPopular && (
                  <span className="text-[10px] font-semibold tracking-wider text-text-tertiary uppercase mb-4">
                    {t(`plans.${planKey}.label`)}
                  </span>
                )}

                {/* Icon */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${
                  isPopular ? "bg-accent/10" : "bg-surface-tertiary dark:bg-dark"
                }`}>
                  {Icon && <Icon size={20} className={isPopular ? "text-accent" : "text-text-tertiary"} />}
                </div>

                {isPopular && <div className="h-3" />}

                <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2">
                  {t(`plans.${planKey}.title`)}
                </h3>
                <p className="text-sm text-text-tertiary mb-6">
                  {t(`plans.${planKey}.description`)}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary dark:text-gray-400">
                      <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="/#contacto"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all ${
                    isPopular
                      ? "bg-accent text-white hover:bg-accent-dark shadow-md shadow-accent/20"
                      : "border border-border dark:border-gray-600 text-text-primary dark:text-white hover:border-primary hover:text-primary"
                  }`}
                >
                  <span>{t("getStarted")}</span>
                  <FiArrowRight size={16} />
                </a>
              </div>
            );
          })}
        </div>

        {/* Custom Solution */}
        <div className="card p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 blur-[40px] rounded-full" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2">
                {t("plans.customSolution.title")}
              </h3>
              <p className="text-sm text-text-secondary dark:text-gray-400 max-w-lg">
                {t("plans.customSolution.description")}
              </p>
            </div>
            <a
              href="/#contacto"
              className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-dark transition-colors whitespace-nowrap"
            >
              <span>{t("contactForQuote")}</span>
              <FiArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}