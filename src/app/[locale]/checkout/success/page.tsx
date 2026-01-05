'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { Link } from '@/i18n/navigation';
import { CheckCircle, Package, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CheckoutSuccessPage() {
  const t = useTranslations('Ecommerce');
  const clearCart = useCartStore((state) => state.clearCart);

  // Limpiar carrito al montar el componente
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="pt-14 sm:pt-16 min-h-screen flex items-center justify-center">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            ¡Compra realizada con éxito!
          </h1>
          
          <p className="text-sm sm:text-base text-gray-300 mb-8">
            Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación con los detalles de tu compra.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-dark-lighter p-4 rounded-lg border border-dark-lighter">
              <Package size={24} className="text-primary mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">Estado del pedido</h3>
              <p className="text-xs text-gray-400">
                Revisa el estado de tu pedido en tu email
              </p>
            </div>
            <div className="bg-dark-lighter p-4 rounded-lg border border-dark-lighter">
              <CheckCircle size={24} className="text-primary mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">Confirmación</h3>
              <p className="text-xs text-gray-400">
                Te enviamos un email con los detalles
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/productos" className="btn-primary w-full sm:w-auto text-center">
              Seguir comprando
            </Link>
            <Link href="/" className="btn-secondary w-full sm:w-auto text-center flex items-center justify-center gap-2">
              <Home size={18} />
              <span>Ir al inicio</span>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t border-dark-lighter">
            <p className="text-xs text-gray-400">
              ¿Necesitas ayuda? Contáctanos a{' '}
              <a href="mailto:lisandroandia14@gmail.com" className="text-primary hover:text-primary/80">
                lisandroandia14@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}