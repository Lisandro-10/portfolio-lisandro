'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { Link } from '@/i18n/navigation';
import { CheckCircle, Package, Home, Copy, MessageCircle } from 'lucide-react';
import { useState } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const clearCart = useCartStore((state) => state.clearCart);
  const [copied, setCopied] = useState(false);

  // Limpiar carrito al montar
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleCopyOrder = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // WhatsApp message
  const whatsappNumber = '542612657201';
  const whatsappMessage = encodeURIComponent(
    `¡Hola! Acabo de realizar el pedido #${orderNumber}. Quisiera coordinar el pago y envío.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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
            ¡Pedido registrado!
          </h1>
          
          {orderNumber && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Número de pedido</p>
              <div className="inline-flex items-center gap-2 bg-dark-lighter px-4 py-2 rounded-lg">
                <span className="text-2xl font-bold text-primary">#{orderNumber}</span>
                <button
                  onClick={handleCopyOrder}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Copiar número"
                >
                  <Copy size={16} />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-500 mt-1">¡Copiado!</p>
              )}
            </div>
          )}

          <p className="text-sm sm:text-base text-gray-300 mb-8">
            Tu pedido fue registrado exitosamente. Nos pondremos en contacto para coordinar el pago y envío.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-dark-lighter p-4 rounded-lg border border-dark-lighter">
              <Package size={24} className="text-primary mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">Próximo paso</h3>
              <p className="text-xs text-gray-400">
                Te contactaremos por WhatsApp o email para coordinar
              </p>
            </div>
            <div className="bg-dark-lighter p-4 rounded-lg border border-dark-lighter">
              <MessageCircle size={24} className="text-primary mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">¿Apurado?</h3>
              <p className="text-xs text-gray-400">
                Escribinos por WhatsApp para agilizar
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto text-center flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              <span>Contactar por WhatsApp</span>
            </a>
            <Link href="/productos" className="btn-secondary w-full sm:w-auto text-center flex items-center justify-center gap-2">
              <span>Seguir comprando</span>
            </Link>
          </div>

          {/* Payment Methods Info */}
          <div className="mt-8 pt-8 border-t border-dark-lighter">
            <p className="text-sm font-semibold mb-3">Métodos de pago aceptados</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400">
              <span className="bg-dark px-3 py-1 rounded">Transferencia bancaria</span>
              <span className="bg-dark px-3 py-1 rounded">MercadoPago</span>
              <span className="bg-dark px-3 py-1 rounded">Efectivo</span>
            </div>
          </div>

          {/* Support */}
          <div className="mt-6">
            <p className="text-xs text-gray-400">
              ¿Preguntas? Escribinos a{' '}
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="pt-14 sm:pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}