"use client";

import { useCartStore } from "@/stores/cart-store";
import { useTranslations } from "next-intl";

interface CartSummaryProps {
  className?: string;
  showShipping?: boolean;
}

export default function CartSummary({ 
  className = "",
  showShipping = true 
}: CartSummaryProps) {
  const t = useTranslations("Ecommerce");
  const totalPrice = useCartStore((state) => state.totalPrice());

  return (
    <div className={className}>
      <div className="space-y-3 mb-4 pb-4 border-b border-dark">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{t("subtotal")}</span>
          <span className="font-semibold text-white">
            ${totalPrice.toLocaleString("es-AR")}
          </span>
        </div>
        
        {showShipping && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Envío</span>
            <span className="text-gray-400 text-xs">
              Calculado en checkout
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-baseline">
        <span className="text-base font-bold">{t("total")}</span>
        <span className="text-2xl font-bold text-primary">
          ${totalPrice.toLocaleString("es-AR")}
        </span>
      </div>
    </div>
  );
}