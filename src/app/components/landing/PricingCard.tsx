import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  deliveryTime: string;
  isRecommended?: boolean;
  note?: string;
}

export default function PricingCard({
  title,
  price,
  description,
  features,
  deliveryTime,
  isRecommended = false,
  note,
}: PricingCardProps) {
  const t = useTranslations("Services");

  return (
    <div
      className={`relative flex flex-col h-full bg-dark-lighter rounded-xl border transition-all duration-300 ${
        isRecommended
          ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]"
          : "border-dark-lighter hover:border-primary/50"
      }`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-dark text-xs sm:text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
            {t("recommended")}
          </span>
        </div>
      )}

      <div className="p-4 sm:p-6 flex flex-col h-full">
        <div className={`text-center ${isRecommended ? "pt-2" : ""}`}>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mb-4">{description}</p>
        </div>

        <div className="flex-1">
          <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs sm:text-sm text-gray-300"
              >
                <Check
                  size={16}
                  className="text-primary flex-shrink-0 mt-0.5"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center mb-4">
          <p className="text-xs sm:text-sm text-gray-400">
            {t("delivery")}{" "}
            <span className="text-white font-medium">{deliveryTime}</span>
          </p>
        </div>

        {note && (
          <p className="text-xs text-gray-500 text-center mb-4 italic">
            {note}
          </p>
        )}

        {/* <a
          href="#contacto-servicios"
          className={`w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg text-center transition-all duration-300 ${
            isRecommended
              ? "bg-primary text-dark hover:bg-primary/90"
              : "border-2 border-primary text-primary hover:bg-primary hover:text-dark"
          }`}
        >
          {t("requestQuote")}
        </a> */}
      </div>
    </div>
  );
}