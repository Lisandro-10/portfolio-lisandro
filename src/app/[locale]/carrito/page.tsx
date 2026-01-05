'use client';

import { useCartStore } from '@/stores/cart-store';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import CartItem from '@/app/components/cart/CartItem';
import { useTranslations } from 'next-intl';
import { ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';

export default function CarritoPage() {
  const t = useTranslations('Ecommerce');
  const { items, totalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Transformar items del carrito al formato de OrderProduct
      const orderProducts = items.map((item) => ({
        variant_id: item.variantId,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        name: item.name,
      }));

      const response = await fetch('/api/tiendanube/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: orderProducts,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la orden');
      }

      // Orden creada exitosamente
      clearCart();
      // Redirigir a página de éxito con el número de orden
      router.push(`/checkout/success?order=${data.orderNumber}`);
      
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Error al procesar la compra');
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

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-500 font-medium">Error</p>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => (
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
                    A coordinar
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
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Procesando...' : 'Confirmar pedido'}</span>
                {!isLoading && <ArrowRight size={18} />}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Te contactaremos para coordinar el pago y envío
              </p>

              <button
                onClick={() => router.push('/productos')}
                className="btn-secondary w-full mt-3"
                disabled={isLoading}
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