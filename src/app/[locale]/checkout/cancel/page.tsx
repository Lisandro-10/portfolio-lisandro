'use client';

import { Link } from '@/i18n/navigation';
import { XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CheckoutCancelPage() {
  const t = useTranslations('Ecommerce');

  return (
    <main className="pt-14 sm:pt-16 min-h-screen flex items-center justify-center">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <XCircle size={40} className="text-yellow-500" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Checkout cancelado
          </h1>
          
          <p className="text-sm sm:text-base text-gray-300 mb-8">
            No se procesó ningún cargo. Tus productos siguen en el carrito si deseas continuar con la compra.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/carrito" className="btn-primary w-full sm:w-auto text-center flex items-center justify-center gap-2">
              <ShoppingBag size={18} />
              <span>Volver al carrito</span>
            </Link>
            <Link href="/productos" className="btn-secondary w-full sm:w-auto text-center flex items-center justify-center gap-2">
              <ArrowLeft size={18} />
              <span>Seguir comprando</span>
            </Link>
          </div>

          {/* Info */}
          <div className="mt-8 pt-8 border-t border-dark-lighter">
            <p className="text-xs text-gray-400">
              Si tuviste problemas con el pago, intenta nuevamente o contáctanos para ayudarte.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}