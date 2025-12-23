'use client';

import { useCartStore } from '@/stores/cart-store';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import CartItem from '@/app/components/cart/CartItem';
import { useTranslations } from 'next-intl';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CarritoPage() {
  const t = useTranslations('Ecommerce');
  const { items, totalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/tiendanube/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item: any) => ({
            variant_id: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const { checkoutUrl } = await response.json();
      
      // Redirigir al checkout de Tiendanube
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="pt-14 sm:pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            {t('emptyCart')}
          </h1>
          <button 
            onClick={() => router.push('/productos')}
            className="btn-primary"
          >
            {t('continueShopping')}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-14 sm:pt-16">
      <section className="section-container">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
          {t('cart')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item: any) => (
              <CartItem key={item.variantId} item={item} />
            ))}
          </div>

          {/* Resumen - Sticky en desktop */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-dark-lighter p-4 sm:p-6 rounded-lg border border-dark-lighter">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Resumen del pedido
              </h2>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-dark">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="font-semibold">
                    ${totalPrice().toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Envío</span>
                  <span className="text-gray-400 text-xs">
                    Calculado en checkout
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-base font-bold">Total</span>
                <span className="text-xl font-bold text-primary">
                  ${totalPrice().toLocaleString('es-AR')}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Procesando...' : t('checkout')}</span>
                {!isLoading && <ArrowRight size={18} />}
              </button>

              <button
                onClick={() => router.push('/productos')}
                className="btn-secondary w-full mt-3"
              >
                {t('continueShopping')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}