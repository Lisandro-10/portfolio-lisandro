"use client";

import { useEffect } from "react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useHydration } from "@/app/hooks/useHydration";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const t = useTranslations("Ecommerce");
  const router = useRouter();
  const hydrated = useHydration();
  const { items, totalItems, clearCart } = useCartStore();

  // Lock body scroll when open
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

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleCheckout = () => {
    onClose();
    router.push("/carrito");
  };

  const handleContinueShopping = () => {
    onClose();
    router.push("/productos");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300
                    ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-dark-lighter z-50 
                    transform transition-transform duration-300 ease-out shadow-2xl
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark">
          <h2 id="cart-drawer-title" className="text-lg font-bold text-white">
            {t("cart")}
            {hydrated && totalItems() > 0 && (
              <span className="ml-2 text-sm text-primary">
                ({totalItems()} {totalItems() === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-5rem)]">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
              <ShoppingBag size={48} className="text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("emptyCart")}</h3>
              <p className="text-sm text-gray-400 mb-6">
                Agrega productos para comenzar tu compra
              </p>
              <button
                onClick={handleContinueShopping}
                className="btn-primary"
              >
                {t("continueShopping")}
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto scrollbar-custom p-4 space-y-3">
                {items.map((item) => (
                  <CartItem key={item.variantId} item={item} />
                ))}
              </div>

              {/* Footer - Sticky */}
              <div className="border-t border-dark p-4 space-y-4 bg-dark-lighter">
                {/* Summary */}
                <CartSummary />

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <span>{t("checkout")}</span>
                    <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="btn-secondary w-full"
                  >
                    {t("continueShopping")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}