'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore, CartItem as CartItemType } from '@/stores/cart-store';

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-3 sm:gap-4 bg-dark-lighter p-3 sm:p-4 rounded-lg">
      {/* Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-dark flex items-center justify-center text-gray-500">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2">
          {item.name}
        </h3>
        
        {/* Variant options */}
        {item.variantOptions && (
          <p className="text-xs sm:text-sm text-gray-400 mb-1">
            {item.variantOptions}
          </p>
        )}
        
        <p className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-3">
          ${item.price.toLocaleString('es-AR')}
        </p>

        {/* Quantity controls - mobile first */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 bg-dark border border-dark-lighter rounded-lg">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="p-2 hover:bg-dark-lighter transition-colors rounded-l-lg"
              aria-label="Reducir cantidad"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="p-2 hover:bg-dark-lighter transition-colors rounded-r-lg"
              aria-label="Aumentar cantidad"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.variantId)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Eliminar del carrito"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Subtotal (sm+ only) */}
      <div className="hidden sm:flex flex-col items-end justify-between">
        <p className="text-sm text-gray-400">Subtotal</p>
        <p className="text-lg font-bold">
          ${(item.price * item.quantity).toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  );
}